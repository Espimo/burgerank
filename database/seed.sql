-- Datos de ejemplo para BurgeRank
-- Este archivo contiene los datos de ejemplo para pruebas

-- Insertar Restaurantes
INSERT INTO restaurants (name, city, address, phone, website, average_rating, total_reviews, opening_hours, created_at)
VALUES
('Burger Palace', 'Madrid', 'Calle Principal 123, 28001', '+34 91 234 5678', 'www.burgerpalace.es', 4.8, 245, '12:00-23:30', NOW()),
('The Smokehouse', 'Barcelona', 'Paseo de Gracia 456, 08007', '+34 93 234 5678', 'www.thesmokehouse.es', 4.7, 189, '13:00-22:30', NOW()),
('Hamburguesería Las Delicias', 'Valencia', 'Calle del Mercado 789, 46001', '+34 96 234 5678', 'www.lasdelicias.es', 4.6, 156, '12:00-23:00', NOW()),
('Gourmet Burgers Co.', 'Sevilla', 'Avenida Constitución 789, 41002', '+34 95 234 5678', 'www.gourmetburgers.es', 4.9, 267, '12:00-00:00', NOW()),
('Taquería Mexicana', 'Madrid', 'Gran Vía 321, 28013', '+34 91 555 6789', 'www.taqueriam.es', 4.5, 134, '12:00-23:00', NOW()),
('Route 66 Diner', 'Bilbao', 'Casco Viejo 555, 48005', '+34 94 234 5678', 'www.route66diner.es', 4.7, 178, '11:00-23:30', NOW()),
('Green Burgers', 'Barcelona', 'Carrer de Còrsega 222, 08008', '+34 93 555 6789', 'www.greenburgers.cat', 4.8, 145, '13:00-22:00', NOW()),
('Burger Lab', 'Valencia', 'Plaza de la Virgen 100, 46003', '+34 96 555 6789', 'www.burgerlab.es', 4.7, 132, '12:30-23:30', NOW()),
('El Desayunador', 'Madrid', 'Calle del Almirante 789, 28004', '+34 91 666 7890', 'www.eldesayunador.es', 4.4, 98, '08:00-22:00', NOW()),
('Premium Burgers', 'Sevilla', 'Calle Betis 321, 41010', '+34 95 666 7890', 'www.premiumburgers.es', 4.6, 167, '12:00-23:00', NOW());

-- Insertar Hamburguesas
INSERT INTO hamburgers (name, restaurant_id, price, rating, reviews, description, created_at)
VALUES
-- Burger Palace
('The King', 1, 12.99, 9.7, 52, 'Doble carne, queso cheddar, bacon, lechuga y tomate', NOW()),
('Royal Deluxe', 1, 14.99, 9.5, 38, 'Triple carne con setas salteadas y queso azul', NOW()),
('BBQ Smoke', 1, 11.99, 9.2, 31, 'Carne ahumada con salsa BBQ casera', NOW()),
('Vegetariana Deluxe', 1, 10.99, 8.8, 24, 'Lenteja especiada, aguacate y vegetales frescos', NOW()),
('Picante Jalapeño', 1, 11.99, 8.6, 19, 'Carne especiada con jalapeños frescos y salsa picante', NOW()),
-- The Smokehouse
('Smoky BBQ Delight', 2, 13.99, 9.4, 45, 'Carne ahumada con salsa BBQ premium', NOW()),
('Smoke Master', 2, 15.99, 9.3, 38, 'Carnes ahumadas mixtas con humo de roble', NOW()),
-- Hamburguesería Las Delicias
('Doble Sabor Clásico', 3, 11.50, 9.1, 42, 'Hamburguesa clásica con doble carne y queso fundido', NOW()),
('Trufa y Champiñones', 3, 13.50, 8.9, 28, 'Carne con salsa de trufa y champiñones salteados', NOW()),
-- Gourmet Burgers Co.
('Gourmet Cheese Premium', 4, 16.99, 9.6, 72, 'Triple queso premium: cheddar, azul y brie', NOW()),
('Executive Gold', 4, 18.99, 9.8, 64, 'Carnes premium con trufa negra y queso de cabra', NOW()),
-- Taquería Mexicana
('Picante Jalapeño', 5, 11.99, 8.7, 35, 'Carne especiada con jalapeños y salsa mexicana', NOW()),
('Quesadilla Burger', 5, 12.99, 8.6, 29, 'Carne con queso Oaxaca y cebollitas caramelizadas', NOW()),
-- Route 66 Diner
('Clásica Americana', 6, 11.99, 9.0, 51, 'Auténtica hamburguesa americana de tamaño generoso', NOW()),
('Route 66 Special', 6, 13.99, 9.1, 39, 'Carne con salsa especial de la casa', NOW()),
-- Green Burgers
('Vegetariana Gourmet', 7, 11.99, 9.2, 48, 'Lenteja con aguacate, quinoa y vegetales frescos', NOW()),
('Veggie Premium', 7, 13.99, 9.0, 32, 'Hamburguesa de setas con queso vegano premium', NOW()),
-- Burger Lab
('Smash Burger Crujiente', 8, 11.50, 9.3, 44, 'Técnica smash con pan tostado', NOW()),
('Lab Experiment', 8, 13.99, 9.2, 37, 'Carne con cremosos especiales de la casa', NOW()),
-- El Desayunador
('Bacon & Huevo', 9, 10.99, 8.5, 29, 'Carne con huevo frito y bacon crujiente', NOW()),
('Desayuno Completo', 9, 11.99, 8.7, 23, 'Carne con huevo, bacon, queso y setas', NOW()),
-- Premium Burgers
('Trufada Negra', 10, 14.99, 9.1, 41, 'Carne con trufa negra y queso azul', NOW()),
('Diamond Burger', 10, 16.99, 9.3, 35, 'Carne premium con combinación de quesos premium', NOW());

-- Insertar Etiquetas/Tags de Hamburguesas
INSERT INTO hamburger_tags (hamburger_id, tag, created_at)
VALUES
-- The King (id 1)
(1, 'Clásica', NOW()), (1, 'Doble carne', NOW()), (1, 'Premium', NOW()),
-- Royal Deluxe (id 2)
(2, 'Premium', NOW()), (2, 'Gourmet', NOW()), (2, 'Triple carne', NOW()),
-- BBQ Smoke (id 3)
(3, 'Ahumada', NOW()), (3, 'BBQ', NOW()),
-- Vegetariana Deluxe (id 4)
(4, 'Vegetariana', NOW()), (4, 'Saludable', NOW()),
-- Picante Jalapeño (id 5)
(5, 'Picante', NOW()), (5, 'Especiada', NOW()),
-- Smoky BBQ Delight (id 6)
(6, 'Ahumada', NOW()), (6, 'BBQ', NOW()), (6, 'Specialty', NOW()),
-- Smoke Master (id 7)
(7, 'Premium', NOW()), (7, 'Ahumada', NOW()),
-- Doble Sabor Clásico (id 8)
(8, 'Clásica', NOW()), (8, 'Doble carne', NOW()),
-- Trufa y Champiñones (id 9)
(9, 'Gourmet', NOW()), (9, 'Premium', NOW()),
-- Gourmet Cheese Premium (id 10)
(10, 'Gourmet', NOW()), (10, 'Premium', NOW()), (10, 'Quesos', NOW()),
-- Executive Gold (id 11)
(11, 'Luxury', NOW()), (11, 'Trufa', NOW()), (11, 'Premium', NOW()),
-- Picante Jalapeño (Taquería) (id 12)
(12, 'Picante', NOW()), (12, 'Mexicana', NOW()),
-- Quesadilla Burger (id 13)
(13, 'Mexicana', NOW()), (13, 'Queso', NOW()),
-- Clásica Americana (id 14)
(14, 'Clásica', NOW()), (14, 'Americana', NOW()),
-- Route 66 Special (id 15)
(15, 'Especial', NOW()), (15, 'Casa', NOW()),
-- Vegetariana Gourmet (id 16)
(16, 'Vegetariana', NOW()), (16, 'Gourmet', NOW()), (16, 'Saludable', NOW()),
-- Veggie Premium (id 17)
(17, 'Vegetariana', NOW()), (17, 'Premium', NOW()), (17, 'Vegana', NOW()),
-- Smash Burger Crujiente (id 18)
(18, 'Smash', NOW()), (18, 'Crujiente', NOW()),
-- Lab Experiment (id 19)
(19, 'Experimental', NOW()), (19, 'Casa', NOW()),
-- Bacon & Huevo (id 20)
(20, 'Desayuno', NOW()), (20, 'Bacon', NOW()),
-- Desayuno Completo (id 21)
(21, 'Desayuno', NOW()), (21, 'Completo', NOW()),
-- Trufada Negra (id 22)
(22, 'Trufa', NOW()), (22, 'Premium', NOW()),
-- Diamond Burger (id 23)
(23, 'Premium', NOW()), (23, 'Luxury', NOW());

-- Insertar Usuarios (si tu tabla de usuarios existe)
-- INSERT INTO users (username, email, city, total_points, average_rating, created_at)
-- VALUES
-- ('usuario_burguer', 'usuario@example.com', 'Madrid', 245, 8.7, NOW()),
-- ('foodlover_madrid', 'foodlover@example.com', 'Madrid', 189, 8.9, NOW()),
-- ('crítico_gastro', 'critico@example.com', 'Barcelona', 156, 8.5, NOW());

-- Insertar Calificaciones/Ratings
INSERT INTO ratings (hamburger_id, username, rating, comment, created_at)
VALUES
-- The King
(1, 'usuario_burguer', 5, 'Hamburguesa increíble, muy jugosa y bien presentada.', NOW() - INTERVAL '2 hours'),
-- Smoky BBQ Delight
(6, 'foodlover_madrid', 4, 'Excelente sabor ahumado. Un poco más de carne habría sido perfecto.', NOW() - INTERVAL '1 day'),
-- Doble Sabor Clásico
(8, 'crítico_gastro', 4, 'Muy buena relación calidad-precio. Recomendado.', NOW() - INTERVAL '3 days'),
-- Gourmet Cheese Premium
(10, 'usuario_burguer', 5, 'Los quesos combinan perfectamente, una experiencia premium.', NOW() - INTERVAL '5 days'),
-- Picante Jalapeño (Taquería)
(12, 'foodlover_madrid', 4, 'Muy picante para algunos, pero deliciosa. Ideal con cerveza fría.', NOW() - INTERVAL '7 days'),
-- Clásica Americana
(14, 'crítico_gastro', 4, 'Auténtica hamburguesa americana. Tamaño generoso.', NOW() - INTERVAL '10 days'),
-- Vegetariana Gourmet
(16, 'usuario_burguer', 5, 'Sorprendentemente deliciosa incluso sin carne. La lenteja está perfecta.', NOW() - INTERVAL '14 days'),
-- Smash Burger Crujiente
(18, 'foodlover_madrid', 4, 'Técnica smash ejecutada correctamente. Muy crujiente por fuera.', NOW() - INTERVAL '14 days'),
-- Bacon & Huevo
(20, 'crítico_gastro', 3, 'Buen desayuno, pero el huevo estaba ligeramente pasado.', NOW() - INTERVAL '21 days'),
-- Trufada Negra
(22, 'usuario_burguer', 4, 'La trufa le da un toque especial, un poco cara pero vale la pena.', NOW() - INTERVAL '30 days');

-- Notas:
-- 1. Reemplaza los nombres de las tablas si son diferentes en tu esquema
-- 2. Ajusta los nombres de las columnas según tu estructura de base de datos
-- 3. Los intervalos de tiempo se pueden ajustar según sea necesario
-- 4. Asegúrate de que los IDs de las relaciones (restaurant_id, hamburger_id) sean correctos
-- 5. Descomenta la sección de usuarios si tu tabla de usuarios existe
