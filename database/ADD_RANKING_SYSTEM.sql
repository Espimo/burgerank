-- ============================================
-- SISTEMA DE RANKING AVANZADO PARA BURGERANK
-- ============================================
-- Implementa Bayesian Average, Wilson Score, 
-- factores de ajuste y protección anti-gaming
-- ============================================

-- ============================================
-- PARTE 1: NUEVAS COLUMNAS EN TABLAS
-- ============================================

-- Añadir columnas de ranking a burgers
ALTER TABLE burgers ADD COLUMN IF NOT EXISTS ranking_score DECIMAL(10,6) DEFAULT 0;
ALTER TABLE burgers ADD COLUMN IF NOT EXISTS ranking_position INTEGER DEFAULT 0;
ALTER TABLE burgers ADD COLUMN IF NOT EXISTS bayesian_score DECIMAL(10,6) DEFAULT 0;
ALTER TABLE burgers ADD COLUMN IF NOT EXISTS wilson_score DECIMAL(10,6) DEFAULT 0;
ALTER TABLE burgers ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0;
ALTER TABLE burgers ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;
ALTER TABLE burgers ADD COLUMN IF NOT EXISTS verified_reviews_count INTEGER DEFAULT 0;
ALTER TABLE burgers ADD COLUMN IF NOT EXISTS positive_reviews_count INTEGER DEFAULT 0;
ALTER TABLE burgers ADD COLUMN IF NOT EXISTS last_review_date TIMESTAMPTZ;
ALTER TABLE burgers ADD COLUMN IF NOT EXISTS standard_deviation DECIMAL(5,3) DEFAULT 0;
ALTER TABLE burgers ADD COLUMN IF NOT EXISTS is_in_ranking BOOLEAN DEFAULT false;
ALTER TABLE burgers ADD COLUMN IF NOT EXISTS flagged_for_review BOOLEAN DEFAULT false;

-- Añadir columnas a ratings si no existen
ALTER TABLE ratings ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
ALTER TABLE ratings ADD COLUMN IF NOT EXISTS has_photo BOOLEAN DEFAULT false;
ALTER TABLE ratings ADD COLUMN IF NOT EXISTS has_ticket BOOLEAN DEFAULT false;
ALTER TABLE ratings ADD COLUMN IF NOT EXISTS weight DECIMAL(3,2) DEFAULT 1.0;
ALTER TABLE ratings ADD COLUMN IF NOT EXISTS is_suspicious BOOLEAN DEFAULT false;

-- Añadir columnas a users/profiles para niveles
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_points INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_level VARCHAR(20) DEFAULT 'burger_fan';

-- Crear índices para optimizar consultas de ranking
CREATE INDEX IF NOT EXISTS idx_burgers_ranking_score ON burgers(ranking_score DESC);
CREATE INDEX IF NOT EXISTS idx_burgers_ranking_position ON burgers(ranking_position);
CREATE INDEX IF NOT EXISTS idx_burgers_is_in_ranking ON burgers(is_in_ranking);
CREATE INDEX IF NOT EXISTS idx_ratings_burger_id ON ratings(burger_id);
CREATE INDEX IF NOT EXISTS idx_ratings_created_at ON ratings(created_at);
CREATE INDEX IF NOT EXISTS idx_ratings_overall_rating ON ratings(overall_rating);

-- ============================================
-- PARTE 2: TABLA DE CONFIGURACIÓN DEL RANKING
-- ============================================

CREATE TABLE IF NOT EXISTS ranking_config (
    id INTEGER PRIMARY KEY DEFAULT 1,
    min_reviews_for_ranking INTEGER DEFAULT 1,
    confidence_threshold INTEGER DEFAULT 25,
    bayesian_weight DECIMAL(3,2) DEFAULT 0.50,
    wilson_weight DECIMAL(3,2) DEFAULT 0.30,
    average_weight DECIMAL(3,2) DEFAULT 0.20,
    max_position_change_per_week INTEGER DEFAULT 20,
    novelty_boost_days INTEGER DEFAULT 30,
    novelty_boost_multiplier DECIMAL(3,2) DEFAULT 1.10,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar/actualizar configuración inicial
INSERT INTO ranking_config (id, min_reviews_for_ranking) 
VALUES (1, 1) 
ON CONFLICT (id) DO UPDATE 
SET min_reviews_for_ranking = EXCLUDED.min_reviews_for_ranking;

-- ============================================
-- PARTE 3: TABLA DE HISTORIAL DE RANKING
-- ============================================

CREATE TABLE IF NOT EXISTS ranking_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    burger_id UUID REFERENCES burgers(id) ON DELETE CASCADE,
    ranking_position INTEGER,
    ranking_score DECIMAL(10,6),
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ranking_history_burger ON ranking_history(burger_id, recorded_at DESC);

-- ============================================
-- PARTE 4: TABLA DE ACTIVIDAD SOSPECHOSA
-- ============================================

CREATE TABLE IF NOT EXISTS suspicious_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    burger_id UUID REFERENCES burgers(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL,
    description TEXT,
    detected_at TIMESTAMPTZ DEFAULT NOW(),
    resolved BOOLEAN DEFAULT false,
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMPTZ
);

-- ============================================
-- PARTE 5: FUNCIONES DE CÁLCULO
-- ============================================

-- Función: Obtener media global de todas las burgers
CREATE OR REPLACE FUNCTION get_global_average_rating()
RETURNS DECIMAL AS $$
DECLARE
    global_avg DECIMAL;
BEGIN
    SELECT COALESCE(AVG(overall_rating), 3.0)
    INTO global_avg
    FROM ratings
    WHERE is_suspicious = false;
    
    RETURN global_avg;
END;
$$ LANGUAGE plpgsql;

-- Función: Calcular Bayesian Score
CREATE OR REPLACE FUNCTION calculate_bayesian_score(p_burger_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    burger_avg DECIMAL;
    burger_count INTEGER;
    global_avg DECIMAL;
    confidence_min INTEGER;
    bayesian DECIMAL;
BEGIN
    -- Obtener configuración
    SELECT confidence_threshold INTO confidence_min FROM ranking_config WHERE id = 1;
    
    -- Obtener media global
    global_avg := get_global_average_rating();
    
    -- Obtener stats de la burger
    SELECT 
        COALESCE(AVG(overall_rating), 0),
        COUNT(*)
    INTO burger_avg, burger_count
    FROM ratings
    WHERE burger_id = p_burger_id
    AND is_suspicious = false;
    
    -- Fórmula Bayesiana: (C * m + n * x) / (C + n)
    -- C = confidence_min, m = global_avg, n = burger_count, x = burger_avg
    IF burger_count = 0 THEN
        RETURN global_avg;
    END IF;
    
    bayesian := (confidence_min * global_avg + burger_count * burger_avg) / (confidence_min + burger_count);
    
    RETURN ROUND(bayesian, 6);
END;
$$ LANGUAGE plpgsql;

-- Función: Calcular Wilson Score (límite inferior del intervalo de confianza 95%)
CREATE OR REPLACE FUNCTION calculate_wilson_score(p_burger_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    positive_count INTEGER;
    total_count INTEGER;
    p_hat DECIMAL;
    z DECIMAL := 1.96; -- 95% confidence
    wilson DECIMAL;
    denominator DECIMAL;
BEGIN
    -- Contar reviews positivas (4-5 estrellas) vs total
    SELECT 
        COUNT(*) FILTER (WHERE overall_rating >= 4),
        COUNT(*)
    INTO positive_count, total_count
    FROM ratings
    WHERE burger_id = p_burger_id
    AND is_suspicious = false;
    
    IF total_count = 0 THEN
        RETURN 0;
    END IF;
    
    -- Proporción de positivas
    p_hat := positive_count::DECIMAL / total_count;
    
    -- Fórmula de Wilson Score (lower bound)
    -- (p + z²/(2n) - z * sqrt((p*(1-p) + z²/(4n))/n)) / (1 + z²/n)
    denominator := 1 + (z * z) / total_count;
    
    wilson := (
        p_hat + (z * z) / (2 * total_count) 
        - z * SQRT((p_hat * (1 - p_hat) + (z * z) / (4 * total_count)) / total_count)
    ) / denominator;
    
    -- Escalar a rango 0-5 para consistencia
    RETURN ROUND(wilson * 5, 6);
END;
$$ LANGUAGE plpgsql;

-- Función: Calcular factor de verificación
CREATE OR REPLACE FUNCTION calculate_verification_factor(p_burger_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    total_reviews INTEGER;
    verified_reviews INTEGER;
    photo_reviews INTEGER;
    ticket_reviews INTEGER;
    factor DECIMAL := 1.0;
BEGIN
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE is_verified = true),
        COUNT(*) FILTER (WHERE has_photo = true),
        COUNT(*) FILTER (WHERE has_ticket = true)
    INTO total_reviews, verified_reviews, photo_reviews, ticket_reviews
    FROM ratings
    WHERE burger_id = p_burger_id
    AND is_suspicious = false;
    
    IF total_reviews = 0 THEN
        RETURN 1.0;
    END IF;
    
    -- Calcular factor promedio ponderado
    -- Sin verificación: 1.0, Con foto: 1.1, Con ticket: 1.15
    factor := (
        (total_reviews - photo_reviews - ticket_reviews) * 1.0 +
        (photo_reviews - ticket_reviews) * 1.1 +
        ticket_reviews * 1.15
    ) / total_reviews;
    
    RETURN ROUND(factor, 4);
END;
$$ LANGUAGE plpgsql;

-- Función: Calcular factor de usuario (nivel de los reviewers)
CREATE OR REPLACE FUNCTION calculate_user_factor(p_burger_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    avg_factor DECIMAL;
BEGIN
    SELECT COALESCE(AVG(
        CASE u.user_level
            WHEN 'burger_obsessed' THEN 1.2
            WHEN 'burger_lover' THEN 1.1
            ELSE 1.0
        END
    ), 1.0)
    INTO avg_factor
    FROM ratings r
    JOIN users u ON r.user_id = u.id
    WHERE r.burger_id = p_burger_id
    AND r.is_suspicious = false;
    
    RETURN ROUND(avg_factor, 4);
END;
$$ LANGUAGE plpgsql;

-- Función: Calcular factor de recencia
CREATE OR REPLACE FUNCTION calculate_recency_factor(p_burger_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    avg_age_days DECIMAL;
    factor DECIMAL;
BEGIN
    SELECT COALESCE(AVG(EXTRACT(DAY FROM (NOW() - created_at))), 365)
    INTO avg_age_days
    FROM ratings
    WHERE burger_id = p_burger_id
    AND is_suspicious = false;
    
    -- Factor según antigüedad promedio de las reviews
    factor := CASE
        WHEN avg_age_days <= 30 THEN 1.10   -- <1 mes
        WHEN avg_age_days <= 180 THEN 1.05  -- 1-6 meses
        WHEN avg_age_days <= 365 THEN 1.00  -- 6-12 meses
        ELSE 0.95                            -- >1 año
    END;
    
    RETURN factor;
END;
$$ LANGUAGE plpgsql;

-- Función: Calcular penalización por varianza alta
CREATE OR REPLACE FUNCTION calculate_variance_penalty(p_burger_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    std_dev DECIMAL;
    penalty DECIMAL;
BEGIN
    SELECT COALESCE(STDDEV(overall_rating), 0)
    INTO std_dev
    FROM ratings
    WHERE burger_id = p_burger_id
    AND is_suspicious = false;
    
    -- Penalización según desviación estándar
    penalty := CASE
        WHEN std_dev < 0.5 THEN 1.0
        WHEN std_dev <= 1.0 THEN 0.95
        ELSE 0.85
    END;
    
    -- Guardar la desviación estándar en la burger
    UPDATE burgers SET standard_deviation = std_dev WHERE id = p_burger_id;
    
    RETURN penalty;
END;
$$ LANGUAGE plpgsql;

-- Función: Calcular boost de novedad
CREATE OR REPLACE FUNCTION calculate_novelty_boost(p_burger_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    burger_created_at TIMESTAMPTZ;
    days_old INTEGER;
    boost_days INTEGER;
    boost_multiplier DECIMAL;
BEGIN
    -- Obtener fecha de creación de la burger
    SELECT created_at INTO burger_created_at FROM burgers WHERE id = p_burger_id;
    
    -- Obtener configuración
    SELECT novelty_boost_days, novelty_boost_multiplier 
    INTO boost_days, boost_multiplier 
    FROM ranking_config WHERE id = 1;
    
    days_old := EXTRACT(DAY FROM (NOW() - burger_created_at));
    
    IF days_old <= boost_days THEN
        RETURN boost_multiplier;
    END IF;
    
    RETURN 1.0;
END;
$$ LANGUAGE plpgsql;

-- Función: Calcular score final de ranking
CREATE OR REPLACE FUNCTION calculate_final_ranking_score(p_burger_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    bayesian DECIMAL;
    wilson DECIMAL;
    avg_rating DECIMAL;
    total_count INTEGER;
    verified_count INTEGER;
    positive_count INTEGER;
    verification_factor DECIMAL;
    user_factor DECIMAL;
    recency_factor DECIMAL;
    variance_penalty DECIMAL;
    novelty_boost DECIMAL;
    final_score DECIMAL;
    bay_weight DECIMAL;
    wil_weight DECIMAL;
    avg_weight DECIMAL;
    min_reviews INTEGER;
BEGIN
    -- Obtener configuración
    SELECT bayesian_weight, wilson_weight, average_weight, min_reviews_for_ranking
    INTO bay_weight, wil_weight, avg_weight, min_reviews
    FROM ranking_config WHERE id = 1;
    
    -- Calcular componentes individuales
    bayesian := calculate_bayesian_score(p_burger_id);
    wilson := calculate_wilson_score(p_burger_id);
    
    -- Calcular promedio simple y conteos
    SELECT 
        COALESCE(AVG(overall_rating), 0),
        COUNT(*),
        COUNT(*) FILTER (WHERE is_verified = true),
        COUNT(*) FILTER (WHERE overall_rating >= 4)
    INTO avg_rating, total_count, verified_count, positive_count
    FROM ratings
    WHERE burger_id = p_burger_id
    AND is_suspicious = false;
    
    -- Calcular factores de ajuste
    verification_factor := calculate_verification_factor(p_burger_id);
    user_factor := calculate_user_factor(p_burger_id);
    recency_factor := calculate_recency_factor(p_burger_id);
    variance_penalty := calculate_variance_penalty(p_burger_id);
    novelty_boost := calculate_novelty_boost(p_burger_id);
    
    -- Fórmula final
    final_score := (bayesian * bay_weight + wilson * wil_weight + avg_rating * avg_weight)
                   * verification_factor
                   * user_factor
                   * recency_factor
                   * variance_penalty
                   * novelty_boost;
    
    -- Actualizar campos en la burger
    UPDATE burgers SET
        ranking_score = ROUND(final_score, 6),
        bayesian_score = bayesian,
        wilson_score = wilson,
        average_rating = ROUND(avg_rating, 2),
        total_reviews = total_count,
        verified_reviews_count = verified_count,
        positive_reviews_count = positive_count,
        last_review_date = (SELECT MAX(created_at) FROM ratings WHERE burger_id = p_burger_id),
        is_in_ranking = (total_count >= min_reviews)
    WHERE id = p_burger_id;
    
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- PARTE 6: FUNCIONES DE ACTUALIZACIÓN DE RANKING
-- ============================================

-- Función: Actualizar todas las posiciones del ranking
CREATE OR REPLACE FUNCTION update_all_ranking_positions()
RETURNS void AS $$
DECLARE
    burger_record RECORD;
    current_position INTEGER := 0;
    prev_score DECIMAL := NULL;
    prev_wilson DECIMAL := NULL;
    prev_verified_pct DECIMAL := NULL;
    prev_five_star_pct DECIMAL := NULL;
    prev_last_review TIMESTAMPTZ := NULL;
BEGIN
    -- Recalcular scores de todas las burgers aprobadas
    FOR burger_record IN 
        SELECT id FROM burgers WHERE status = 'approved'
    LOOP
        PERFORM calculate_final_ranking_score(burger_record.id);
    END LOOP;
    
    -- Asignar posiciones con criterios de desempate
    FOR burger_record IN 
        SELECT 
            b.id,
            b.ranking_score,
            b.wilson_score,
            CASE WHEN b.total_reviews > 0 
                THEN b.verified_reviews_count::DECIMAL / b.total_reviews 
                ELSE 0 END as verified_pct,
            CASE WHEN b.total_reviews > 0 
                THEN (SELECT COUNT(*) FROM ratings WHERE burger_id = b.id AND overall_rating = 5)::DECIMAL / b.total_reviews 
                ELSE 0 END as five_star_pct,
            b.last_review_date,
            b.is_in_ranking
        FROM burgers b
        WHERE b.status = 'approved' AND b.is_in_ranking = true
        ORDER BY 
            b.ranking_score DESC,
            b.wilson_score DESC,
            verified_pct DESC,
            five_star_pct DESC,
            b.last_review_date DESC NULLS LAST,
            b.id ASC
    LOOP
        current_position := current_position + 1;
        
        UPDATE burgers 
        SET ranking_position = current_position
        WHERE id = burger_record.id;
    END LOOP;
    
    -- Guardar snapshot en historial (una vez al día)
    INSERT INTO ranking_history (burger_id, ranking_position, ranking_score)
    SELECT id, ranking_position, ranking_score
    FROM burgers
    WHERE is_in_ranking = true;
END;
$$ LANGUAGE plpgsql;

-- Función: Recalcular ranking de una sola burger y ajustar posiciones cercanas
CREATE OR REPLACE FUNCTION update_single_burger_ranking(p_burger_id UUID)
RETURNS void AS $$
DECLARE
    old_score DECIMAL;
    new_score DECIMAL;
    old_position INTEGER;
BEGIN
    -- Guardar score anterior
    SELECT ranking_score, ranking_position INTO old_score, old_position
    FROM burgers WHERE id = p_burger_id;
    
    -- Recalcular score
    new_score := calculate_final_ranking_score(p_burger_id);
    
    -- Si el cambio es significativo, actualizar posiciones de todas las burgers
    -- En producción, optimizar para solo actualizar burgers cercanas
    IF ABS(COALESCE(new_score, 0) - COALESCE(old_score, 0)) > 0.001 THEN
        PERFORM update_all_ranking_positions();
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- PARTE 7: FUNCIONES ANTI-GAMING
-- ============================================

-- Función: Detectar actividad sospechosa
CREATE OR REPLACE FUNCTION detect_suspicious_activity(p_burger_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    suspicious_found BOOLEAN := false;
    high_rating_same_day INTEGER;
    new_user_five_stars INTEGER;
BEGIN
    -- Detectar: 10+ valoraciones 5⭐ en 24h
    SELECT COUNT(*) INTO high_rating_same_day
    FROM ratings
    WHERE burger_id = p_burger_id
    AND overall_rating = 5
    AND created_at > NOW() - INTERVAL '24 hours';
    
    IF high_rating_same_day >= 10 THEN
        INSERT INTO suspicious_activity (burger_id, activity_type, description)
        VALUES (p_burger_id, 'BURST_HIGH_RATINGS', 
                '10+ valoraciones 5 estrellas en menos de 24 horas');
        suspicious_found := true;
        
        -- Marcar burger para revisión
        UPDATE burgers SET flagged_for_review = true WHERE id = p_burger_id;
    END IF;
    
    -- Detectar: Usuarios nuevos (<7 días) dando 5⭐
    SELECT COUNT(*) INTO new_user_five_stars
    FROM ratings r
    JOIN users u ON r.user_id = u.id
    WHERE r.burger_id = p_burger_id
    AND r.overall_rating = 5
    AND u.created_at > NOW() - INTERVAL '7 days'
    AND r.created_at > NOW() - INTERVAL '24 hours';
    
    IF new_user_five_stars >= 5 THEN
        INSERT INTO suspicious_activity (burger_id, activity_type, description)
        VALUES (p_burger_id, 'NEW_USER_BURST', 
                '5+ usuarios nuevos dando 5 estrellas en 24 horas');
        suspicious_found := true;
        
        -- Reducir peso de esas reviews
        UPDATE ratings SET weight = 0.5
        WHERE burger_id = p_burger_id
        AND user_id IN (
            SELECT id FROM users WHERE created_at > NOW() - INTERVAL '7 days'
        );
    END IF;
    
    RETURN suspicious_found;
END;
$$ LANGUAGE plpgsql;

-- Función: Marcar reviews sin comentario ni foto con 5⭐
CREATE OR REPLACE FUNCTION apply_review_weight_adjustments()
RETURNS void AS $$
BEGIN
    -- Reviews sin comentario, sin foto, con 5⭐ → peso reducido
    UPDATE ratings
    SET weight = 0.7
    WHERE overall_rating = 5
    AND (comment IS NULL OR comment = '')
    AND has_photo = false
    AND weight = 1.0;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- PARTE 8: TRIGGERS
-- ============================================

-- Trigger: Después de insertar una nueva rating
CREATE OR REPLACE FUNCTION trigger_after_rating_insert()
RETURNS TRIGGER AS $$
BEGIN
    -- Detectar actividad sospechosa
    PERFORM detect_suspicious_activity(NEW.burger_id);
    
    -- Recalcular ranking de la burger
    PERFORM update_single_burger_ranking(NEW.burger_id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS after_rating_insert ON ratings;
CREATE TRIGGER after_rating_insert
    AFTER INSERT ON ratings
    FOR EACH ROW
    EXECUTE FUNCTION trigger_after_rating_insert();

-- Trigger: Después de actualizar una rating
CREATE OR REPLACE FUNCTION trigger_after_rating_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Recalcular ranking de la burger afectada
    PERFORM update_single_burger_ranking(NEW.burger_id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS after_rating_update ON ratings;
CREATE TRIGGER after_rating_update
    AFTER UPDATE ON ratings
    FOR EACH ROW
    EXECUTE FUNCTION trigger_after_rating_update();

-- Trigger: Después de eliminar una rating
CREATE OR REPLACE FUNCTION trigger_after_rating_delete()
RETURNS TRIGGER AS $$
BEGIN
    -- Recalcular ranking de la burger afectada
    PERFORM update_single_burger_ranking(OLD.burger_id);
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS after_rating_delete ON ratings;
CREATE TRIGGER after_rating_delete
    AFTER DELETE ON ratings
    FOR EACH ROW
    EXECUTE FUNCTION trigger_after_rating_delete();

-- Trigger: Actualizar nivel de usuario cuando cambian sus puntos
CREATE OR REPLACE FUNCTION trigger_update_user_level()
RETURNS TRIGGER AS $$
BEGIN
    NEW.user_level := CASE
        WHEN NEW.total_points > 2000 THEN 'burger_obsessed'
        WHEN NEW.total_points > 500 THEN 'burger_lover'
        ELSE 'burger_fan'
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_user_level ON users;
CREATE TRIGGER update_user_level
    BEFORE UPDATE OF total_points ON users
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_user_level();

-- ============================================
-- PARTE 9: FUNCIÓN PARA OBTENER DETALLES DEL RANKING
-- ============================================

CREATE OR REPLACE FUNCTION get_burger_ranking_details(p_burger_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'burger_id', b.id,
        'burger_name', b.name,
        'ranking_position', b.ranking_position,
        'ranking_score', b.ranking_score,
        'is_in_ranking', b.is_in_ranking,
        'scores', json_build_object(
            'bayesian_score', b.bayesian_score,
            'wilson_score', b.wilson_score,
            'average_rating', b.average_rating
        ),
        'factors', json_build_object(
            'verification_factor', calculate_verification_factor(b.id),
            'user_factor', calculate_user_factor(b.id),
            'recency_factor', calculate_recency_factor(b.id),
            'variance_penalty', calculate_variance_penalty(b.id),
            'novelty_boost', calculate_novelty_boost(b.id)
        ),
        'stats', json_build_object(
            'total_reviews', b.total_reviews,
            'verified_reviews', b.verified_reviews_count,
            'positive_reviews', b.positive_reviews_count,
            'standard_deviation', b.standard_deviation,
            'last_review_date', b.last_review_date
        ),
        'rating_distribution', (
            SELECT json_build_object(
                'five_stars', COUNT(*) FILTER (WHERE overall_rating = 5),
                'four_stars', COUNT(*) FILTER (WHERE overall_rating >= 4 AND overall_rating < 5),
                'three_stars', COUNT(*) FILTER (WHERE overall_rating >= 3 AND overall_rating < 4),
                'two_stars', COUNT(*) FILTER (WHERE overall_rating >= 2 AND overall_rating < 3),
                'one_star', COUNT(*) FILTER (WHERE overall_rating >= 1 AND overall_rating < 2)
            )
            FROM ratings WHERE burger_id = b.id AND is_suspicious = false
        ),
        'flagged_for_review', b.flagged_for_review
    ) INTO result
    FROM burgers b
    WHERE b.id = p_burger_id;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- PARTE 10: VISTAS ÚTILES
-- ============================================

-- Vista: Ranking completo con detalles
CREATE OR REPLACE VIEW v_burger_ranking AS
SELECT 
    b.id,
    b.name,
    b.image_url,
    r.name as restaurant_name,
    c.name as city_name,
    b.ranking_position,
    b.ranking_score,
    b.bayesian_score,
    b.wilson_score,
    b.average_rating,
    b.total_reviews,
    b.verified_reviews_count,
    b.positive_reviews_count,
    b.standard_deviation,
    b.last_review_date,
    b.is_in_ranking,
    CASE WHEN b.total_reviews > 0 
        THEN ROUND((b.verified_reviews_count::DECIMAL / b.total_reviews) * 100, 1)
        ELSE 0 
    END as verified_percentage
FROM burgers b
LEFT JOIN restaurants r ON b.restaurant_id = r.id
LEFT JOIN cities c ON r.city_id = c.id
WHERE b.status = 'approved' AND b.is_in_ranking = true
ORDER BY b.ranking_position ASC;

-- Vista: Burgers nuevas (aún no en ranking principal)
CREATE OR REPLACE VIEW v_new_burgers AS
SELECT 
    b.id,
    b.name,
    b.image_url,
    r.name as restaurant_name,
    c.name as city_name,
    b.average_rating,
    b.total_reviews,
    (SELECT min_reviews_for_ranking FROM ranking_config WHERE id = 1) - b.total_reviews as reviews_needed
FROM burgers b
LEFT JOIN restaurants r ON b.restaurant_id = r.id
LEFT JOIN cities c ON r.city_id = c.id
WHERE b.status = 'approved' 
AND b.is_in_ranking = false
AND b.total_reviews > 0
ORDER BY b.total_reviews DESC, b.average_rating DESC;

-- Vista: Actividad sospechosa pendiente
CREATE OR REPLACE VIEW v_pending_suspicious_activity AS
SELECT 
    sa.id,
    sa.activity_type,
    sa.description,
    sa.detected_at,
    b.name as burger_name,
    r.name as restaurant_name
FROM suspicious_activity sa
JOIN burgers b ON sa.burger_id = b.id
LEFT JOIN restaurants r ON b.restaurant_id = r.id
WHERE sa.resolved = false
ORDER BY sa.detected_at DESC;

-- ============================================
-- PARTE 11: POLÍTICAS RLS
-- ============================================

-- Habilitar RLS en nuevas tablas
ALTER TABLE ranking_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE ranking_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE suspicious_activity ENABLE ROW LEVEL SECURITY;

-- Políticas para ranking_config (solo lectura pública, escritura admin)
CREATE POLICY "ranking_config_read" ON ranking_config FOR SELECT USING (true);
CREATE POLICY "ranking_config_write" ON ranking_config FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- Políticas para ranking_history (lectura pública)
CREATE POLICY "ranking_history_read" ON ranking_history FOR SELECT USING (true);

-- Políticas para suspicious_activity (solo admin)
CREATE POLICY "suspicious_activity_admin" ON suspicious_activity FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- ============================================
-- PARTE 12: INICIALIZACIÓN
-- ============================================

-- Ejecutar cálculo inicial de rankings para todas las burgers existentes
-- NOTA: Ejecutar esto manualmente después de aplicar el script
-- SELECT update_all_ranking_positions();

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
