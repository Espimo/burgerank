-- BurgeRank Extended Seed Data
-- Comprehensive sample data with 100+ burgers for complete testing

-- ============================================================================
-- SAMPLE RESTAURANTS (40 restaurants across all cities)
-- ============================================================================

INSERT INTO public.restaurants (name, city_id, address, phone, hours) VALUES
-- MADRID (8 restaurants)
  ('Burger Palace', (SELECT id FROM public.cities WHERE name = 'Madrid'), 'Calle Principal 123, Madrid', '+34 123 456 789', '12:00 - 23:00'),
  ('Fast Burger', (SELECT id FROM public.cities WHERE name = 'Madrid'), 'Plaza Mayor 321, Madrid', '+34 456 789 012', '12:00 - 23:30'),
  ('Premium Beef', (SELECT id FROM public.cities WHERE name = 'Madrid'), 'Paseo del Prado 456, Madrid', '+34 600 111 222', '13:00 - 00:00'),
  ('Smash Burguer', (SELECT id FROM public.cities WHERE name = 'Madrid'), 'Calle Alcalá 789, Madrid', '+34 600 222 333', '11:30 - 22:30'),
  ('The Burger Lab', (SELECT id FROM public.cities WHERE name = 'Madrid'), 'Gran Vía 101, Madrid', '+34 600 333 444', '12:00 - 23:00'),
  ('Burger King Clone', (SELECT id FROM public.cities WHERE name = 'Madrid'), 'Calle Serrano 202, Madrid', '+34 600 444 555', '10:00 - 23:30'),
  ('Artisan Burgers Madrid', (SELECT id FROM public.cities WHERE name = 'Madrid'), 'Calle Velázquez 303, Madrid', '+34 600 555 666', '13:00 - 22:00'),
  ('Urban Grill Madrid', (SELECT id FROM public.cities WHERE name = 'Madrid'), 'Avenida América 404, Madrid', '+34 600 666 777', '12:00 - 23:00'),

-- BARCELONA (8 restaurants)
  ('Grill House', (SELECT id FROM public.cities WHERE name = 'Barcelona'), 'Avenida Diagonal 456, Barcelona', '+34 234 567 890', '11:00 - 00:00'),
  ('Green Burger', (SELECT id FROM public.cities WHERE name = 'Barcelona'), 'Paseo de Gracia 654, Barcelona', '+34 567 890 123', '10:00 - 22:00'),
  ('Burger Barcelona', (SELECT id FROM public.cities WHERE name = 'Barcelona'), 'Rambla Catalunya 505, Barcelona', '+34 600 777 888', '12:00 - 23:00'),
  ('The Meat House', (SELECT id FROM public.cities WHERE name = 'Barcelona'), 'Paseo Sant Joan 606, Barcelona', '+34 600 888 999', '13:00 - 23:30'),
  ('Burger Eixample', (SELECT id FROM public.cities WHERE name = 'Barcelona'), 'Avenida Mistral 707, Barcelona', '+34 600 999 000', '12:00 - 22:30'),
  ('Craft Burgers BCN', (SELECT id FROM public.cities WHERE name = 'Barcelona'), 'Carrer de la Pau 808, Barcelona', '+34 601 000 111', '14:00 - 23:00'),
  ('Gothic Burger', (SELECT id FROM public.cities WHERE name = 'Barcelona'), 'Carrer Ample 909, Barcelona', '+34 601 111 222', '12:00 - 23:00'),
  ('Montjuïc Grill', (SELECT id FROM public.cities WHERE name = 'Barcelona'), 'Avenida Miramar 1010, Barcelona', '+34 601 222 333', '13:00 - 23:30'),

-- VALENCIA (8 restaurants)
  ('Burger Artisan', (SELECT id FROM public.cities WHERE name = 'Valencia'), 'Calle del Mar 789, Valencia', '+34 345 678 901', '13:00 - 22:00'),
  ('Turia Burgers', (SELECT id FROM public.cities WHERE name = 'Valencia'), 'Avenida Túria 1111, Valencia', '+34 601 333 444', '12:00 - 23:00'),
  ('The Beach Burger', (SELECT id FROM public.cities WHERE name = 'Valencia'), 'Paseo Marítimo 1212, Valencia', '+34 601 444 555', '12:00 - 23:30'),
  ('Valencia Grill', (SELECT id FROM public.cities WHERE name = 'Valencia'), 'Plaza de América 1313, Valencia', '+34 601 555 666', '13:00 - 22:00'),
  ('Burger City Valencia', (SELECT id FROM public.cities WHERE name = 'Valencia'), 'Calle Colón 1414, Valencia', '+34 601 666 777', '12:00 - 23:00'),
  ('Huerta Burgers', (SELECT id FROM public.cities WHERE name = 'Valencia'), 'Avenida Perez Galdós 1515, Valencia', '+34 601 777 888', '14:00 - 23:00'),
  ('Modern Burger Valencia', (SELECT id FROM public.cities WHERE name = 'Valencia'), 'Calle San Vicente 1616, Valencia', '+34 601 888 999', '12:00 - 22:30'),
  ('Premium Valencia', (SELECT id FROM public.cities WHERE name = 'Valencia'), 'Paseo de la Alameda 1717, Valencia', '+34 601 999 000', '13:00 - 23:00'),

-- SEVILLA (8 restaurants)
  ('Andaluz Burger', (SELECT id FROM public.cities WHERE name = 'Sevilla'), 'Calle Betis 1818, Sevilla', '+34 602 000 111', '12:00 - 23:30'),
  ('Giralda Grill', (SELECT id FROM public.cities WHERE name = 'Sevilla'), 'Plaza de España 1919, Sevilla', '+34 602 111 222', '13:00 - 23:00'),
  ('Sevilla Burgers', (SELECT id FROM public.cities WHERE name = 'Sevilla'), 'Avenida Reina Mercedes 2020, Sevilla', '+34 602 222 333', '12:00 - 22:30'),
  ('Flamenco Burger', (SELECT id FROM public.cities WHERE name = 'Sevilla'), 'Barrio Santa Cruz 2121, Sevilla', '+34 602 333 444', '12:00 - 23:00'),
  ('Triana Burger', (SELECT id FROM public.cities WHERE name = 'Sevilla'), 'Calle Betis 2222, Sevilla', '+34 602 444 555', '14:00 - 23:30'),
  ('Premium Sevilla', (SELECT id FROM public.cities WHERE name = 'Sevilla'), 'Avenida República Argentina 2323, Sevilla', '+34 602 555 666', '13:00 - 22:00'),
  ('The Scorcher Sevilla', (SELECT id FROM public.cities WHERE name = 'Sevilla'), 'Calle Castelar 2424, Sevilla', '+34 602 666 777', '12:00 - 23:00'),
  ('Sevilla Craft Burger', (SELECT id FROM public.cities WHERE name = 'Sevilla'), 'Plaza San Francisco 2525, Sevilla', '+34 602 777 888', '12:00 - 23:30'),

-- BILBAO (8 restaurants)
  ('Basque Burger', (SELECT id FROM public.cities WHERE name = 'Bilbao'), 'Gran Vía de Don Diego López 2626, Bilbao', '+34 602 888 999', '12:00 - 23:00'),
  ('Guggenheim Grill', (SELECT id FROM public.cities WHERE name = 'Bilbao'), 'Avenida Abandoibarra 2727, Bilbao', '+34 602 999 000', '13:00 - 22:30'),
  ('Bilbao Burgers', (SELECT id FROM public.cities WHERE name = 'Bilbao'), 'Calle López de Haro 2828, Bilbao', '+34 603 000 111', '12:00 - 23:00'),
  ('Txoko Burger', (SELECT id FROM public.cities WHERE name = 'Bilbao'), 'Paseo del Arenal 2929, Bilbao', '+34 603 111 222', '12:00 - 23:30'),
  ('Casco Viejo Burger', (SELECT id FROM public.cities WHERE name = 'Bilbao'), 'Casco Viejo 3030, Bilbao', '+34 603 222 333', '13:00 - 23:00'),
  ('Artisan Bilbao', (SELECT id FROM public.cities WHERE name = 'Bilbao'), 'Avenida Colón 3131, Bilbao', '+34 603 333 444', '14:00 - 22:30'),
  ('Modern Burger Bilbao', (SELECT id FROM public.cities WHERE name = 'Bilbao'), 'Camino de las Olas 3232, Bilbao', '+34 603 444 555', '12:00 - 23:00'),
  ('Premium Basque', (SELECT id FROM public.cities WHERE name = 'Bilbao'), 'Avenida Lehendakari Aguirre 3333, Bilbao', '+34 603 555 666', '13:00 - 23:30');

-- ============================================================================
-- SAMPLE BURGERS (120 burgers across all restaurants)
-- ============================================================================

INSERT INTO public.burgers (name, restaurant_id, description, position, type, tags, city_id, average_rating, total_ratings) VALUES
-- MADRID BURGERS
  ('The King Burger', (SELECT id FROM public.restaurants WHERE name = 'Burger Palace'), 'Smash beef con queso fundido y bacon crujiente', 1, 'premium', ARRAY['Jugosa', 'Carne Fresca', 'Premium'], (SELECT id FROM public.cities WHERE name = 'Madrid'), 4.8, 245),
  ('Double Stack Madrid', (SELECT id FROM public.restaurants WHERE name = 'Burger Palace'), 'Dos carnes smash con queso americano y cebolla', 2, 'doble', ARRAY['Doble', 'Clásica'], (SELECT id FROM public.cities WHERE name = 'Madrid'), 4.6, 198),
  ('Veggie Madrid', (SELECT id FROM public.restaurants WHERE name = 'Burger Palace'), 'Lentejas y setas con aguacate y rúcula', 3, 'vegana', ARRAY['Vegana', 'Sano'], (SELECT id FROM public.cities WHERE name = 'Madrid'), 4.3, 127),
  ('BBQ Master', (SELECT id FROM public.restaurants WHERE name = 'Fast Burger'), 'Ternera con salsa BBQ casera', 4, 'premium', ARRAY['BBQ', 'Ternera'], (SELECT id FROM public.cities WHERE name = 'Madrid'), 4.7, 212),
  ('Classic Madrid', (SELECT id FROM public.restaurants WHERE name = 'Fast Burger'), 'La clásica de toda la vida, simple y perfecta', 5, 'clásica', ARRAY['Clásica', 'Económica'], (SELECT id FROM public.cities WHERE name = 'Madrid'), 4.4, 189),
  ('The Inferno', (SELECT id FROM public.restaurants WHERE name = 'Fast Burger'), 'Picante con jalapeños y salsa de fuego', 6, 'premium', ARRAY['Picante', 'Jalapeños'], (SELECT id FROM public.cities WHERE name = 'Madrid'), 4.5, 156),
  ('Premium Gold', (SELECT id FROM public.restaurants WHERE name = 'Premium Beef'), 'Carne wagyu con foie gras', 7, 'premium', ARRAY['Wagyu', 'Luxury'], (SELECT id FROM public.cities WHERE name = 'Madrid'), 4.9, 89),
  ('Truffle Burger', (SELECT id FROM public.restaurants WHERE name = 'Premium Beef'), 'Con queso trufado y cebolla caramelizada', 8, 'premium', ARRAY['Trufado', 'Gourmet'], (SELECT id FROM public.cities WHERE name = 'Madrid'), 4.8, 76),
  ('Smash Classic', (SELECT id FROM public.restaurants WHERE name = 'Smash Burguer'), 'Dos smash con queso y bacon', 9, 'premium', ARRAY['Smash', 'Bacon'], (SELECT id FROM public.cities WHERE name = 'Madrid'), 4.7, 203),
  ('Smash Doble Queso', (SELECT id FROM public.restaurants WHERE name = 'Smash Burguer'), 'Tres quesos diferentes en dos carnes', 10, 'doble', ARRAY['Queso', 'Doble'], (SELECT id FROM public.cities WHERE name = 'Madrid'), 4.6, 167),

-- Add more Madrid burgers
  ('Lab Experiment 1', (SELECT id FROM public.restaurants WHERE name = 'The Burger Lab'), 'Carne con marinada especial', 11, 'premium', ARRAY['Especial', 'Laboratorio'], (SELECT id FROM public.cities WHERE name = 'Madrid'), 4.5, 134),
  ('Artisan Madrid Selection', (SELECT id FROM public.restaurants WHERE name = 'Artisan Burgers Madrid'), 'Pan artesanal con carnes premium', 12, 'premium', ARRAY['Artisanal', 'Premium'], (SELECT id FROM public.cities WHERE name = 'Madrid'), 4.7, 178),
  ('Urban Smash', (SELECT id FROM public.restaurants WHERE name = 'Urban Grill Madrid'), 'Smash con vegetales frescos', 13, 'premium', ARRAY['Smash', 'Fresco'], (SELECT id FROM public.cities WHERE name = 'Madrid'), 4.4, 145),

-- BARCELONA BURGERS
  ('Smoky BBQ', (SELECT id FROM public.restaurants WHERE name = 'Grill House'), 'Ternera con salsa BBQ y cebolla caramelizada', 1, 'premium', ARRAY['BBQ', 'Ternera', 'Salsa'], (SELECT id FROM public.cities WHERE name = 'Barcelona'), 4.7, 186),
  ('Green Supreme', (SELECT id FROM public.restaurants WHERE name = 'Green Burger'), 'Lentejas y setas con aguacate y rúcula', 2, 'vegana', ARRAY['Vegana', 'Sano'], (SELECT id FROM public.cities WHERE name = 'Barcelona'), 4.2, 156),
  ('BCN Meat Heaven', (SELECT id FROM public.restaurants WHERE name = 'Burger Barcelona'), 'Tres tipos de carnes premium', 3, 'premium', ARRAY['Triple', 'Premium'], (SELECT id FROM public.cities WHERE name = 'Barcelona'), 4.6, 198),
  ('Catalan Burger', (SELECT id FROM public.restaurants WHERE name = 'Burger Barcelona'), 'Con tomates de Ribarroja y jamón ibérico', 4, 'premium', ARRAY['Ibérico', 'Local'], (SELECT id FROM public.cities WHERE name = 'Barcelona'), 4.8, 212),
  ('The Beast', (SELECT id FROM public.restaurants WHERE name = 'The Meat House'), 'Gran burger con tres carnes y tocino', 5, 'doble', ARRAY['Beast', 'Triple'], (SELECT id FROM public.cities WHERE name = 'Barcelona'), 4.7, 189),
  ('Eixample Special', (SELECT id FROM public.restaurants WHERE name = 'Burger Eixample'), 'Especialidad de la casa con carnes locales', 6, 'premium', ARRAY['Especial', 'Local'], (SELECT id FROM public.cities WHERE name = 'Barcelona'), 4.5, 167),
  ('Craft Barcelona', (SELECT id FROM public.restaurants WHERE name = 'Craft Burgers BCN'), 'Hecha a mano con ingredientes de calidad', 7, 'premium', ARRAY['Craft', 'Casera'], (SELECT id FROM public.cities WHERE name = 'Barcelona'), 4.6, 143),
  ('Gothic Glory', (SELECT id FROM public.restaurants WHERE name = 'Gothic Burger'), 'Burger medieval con especias antiguas', 8, 'premium', ARRAY['Especial', 'Medieval'], (SELECT id FROM public.cities WHERE name = 'Barcelona'), 4.4, 121),
  ('Montjuïc View', (SELECT id FROM public.restaurants WHERE name = 'Montjuïc Grill'), 'Con vistas y carnes premium', 9, 'premium', ARRAY['Premium', 'Vistas'], (SELECT id FROM public.cities WHERE name = 'Barcelona'), 4.7, 176),

-- More Barcelona burgers
  ('Barcelona Triple Stack', (SELECT id FROM public.restaurants WHERE name = 'The Meat House'), 'Tres carnes apiladas', 10, 'premium', ARRAY['Triple', 'Stack'], (SELECT id FROM public.cities WHERE name = 'Barcelona'), 4.8, 201),
  ('Veggie Delight', (SELECT id FROM public.restaurants WHERE name = 'Green Burger'), 'Vegetales frescos de temporada', 11, 'vegana', ARRAY['Fresco', 'Vegano'], (SELECT id FROM public.cities WHERE name = 'Barcelona'), 4.3, 134),

-- VALENCIA BURGERS
  ('Clásica Tradicional', (SELECT id FROM public.restaurants WHERE name = 'Burger Artisan'), 'Simple pero perfecta, carne de calidad con queso', 1, 'clásica', ARRAY['Clásica', 'Económica'], (SELECT id FROM public.cities WHERE name = 'Valencia'), 4.5, 312),
  ('Turia Premium', (SELECT id FROM public.restaurants WHERE name = 'Turia Burgers'), 'Con ingredientes especiales del río Turia', 2, 'premium', ARRAY['Premium', 'Local'], (SELECT id FROM public.cities WHERE name = 'Valencia'), 4.6, 178),
  ('Beach Special', (SELECT id FROM public.restaurants WHERE name = 'The Beach Burger'), 'Burger fresca con pescado ahumado', 3, 'premium', ARRAY['Pescado', 'Fresca'], (SELECT id FROM public.cities WHERE name = 'Valencia'), 4.4, 145),
  ('Valencia Grill Master', (SELECT id FROM public.restaurants WHERE name = 'Valencia Grill'), 'Especialidad a la parrilla', 4, 'premium', ARRAY['Parrilla', 'Especial'], (SELECT id FROM public.cities WHERE name = 'Valencia'), 4.7, 198),
  ('City Valencia', (SELECT id FROM public.restaurants WHERE name = 'Burger City Valencia'), 'La favorita de la ciudad', 5, 'clásica', ARRAY['Clásica', 'Popular'], (SELECT id FROM public.cities WHERE name = 'Valencia'), 4.4, 167),
  ('Huerta Veggie', (SELECT id FROM public.restaurants WHERE name = 'Huerta Burgers'), 'Vegetales de la huerta valenciana', 6, 'vegana', ARRAY['Huerta', 'Orgánico'], (SELECT id FROM public.cities WHERE name = 'Valencia'), 4.3, 123),
  ('Modern Valencia', (SELECT id FROM public.restaurants WHERE name = 'Modern Burger Valencia'), 'Toque contemporáneo y sabores antiguos', 7, 'premium', ARRAY['Moderno', 'Contemporáneo'], (SELECT id FROM public.cities WHERE name = 'Valencia'), 4.6, 154),
  ('Premium Paella Burger', (SELECT id FROM public.restaurants WHERE name = 'Premium Valencia'), 'Inspirada en la paella con azafrán', 8, 'premium', ARRAY['Azafrán', 'Paella'], (SELECT id FROM public.cities WHERE name = 'Valencia'), 4.8, 189),

-- More Valencia burgers
  ('Artisan Delight', (SELECT id FROM public.restaurants WHERE name = 'Burger Artisan'), 'Hamburguesa artesanal premium', 9, 'premium', ARRAY['Artisanal', 'Delicia'], (SELECT id FROM public.cities WHERE name = 'Valencia'), 4.7, 145),
  ('Beach Fusion', (SELECT id FROM public.restaurants WHERE name = 'The Beach Burger'), 'Fusión de sabores costeros', 10, 'premium', ARRAY['Fusión', 'Costero'], (SELECT id FROM public.cities WHERE name = 'Valencia'), 4.5, 128),

-- SEVILLA BURGERS
  ('Andaluz Classic', (SELECT id FROM public.restaurants WHERE name = 'Andaluz Burger'), 'Clásica andaluza con especias', 1, 'clásica', ARRAY['Andaluz', 'Especias'], (SELECT id FROM public.cities WHERE name = 'Sevilla'), 4.5, 189),
  ('Giralda Premium', (SELECT id FROM public.restaurants WHERE name = 'Giralda Grill'), 'Premium con vistas a la Giralda', 2, 'premium', ARRAY['Premium', 'Monumental'], (SELECT id FROM public.cities WHERE name = 'Sevilla'), 4.7, 167),
  ('Sevilla Signature', (SELECT id FROM public.restaurants WHERE name = 'Sevilla Burgers'), 'La firma de Sevilla', 3, 'premium', ARRAY['Firma', 'Iconic'], (SELECT id FROM public.cities WHERE name = 'Sevilla'), 4.6, 145),
  ('Flamenco Spice', (SELECT id FROM public.restaurants WHERE name = 'Flamenco Burger'), 'Con un toque de especias flamenco', 4, 'premium', ARRAY['Especias', 'Flamenco'], (SELECT id FROM public.cities WHERE name = 'Sevilla'), 4.4, 134),
  ('Triana Soul', (SELECT id FROM public.restaurants WHERE name = 'Triana Burger'), 'El alma de Triana en una burger', 5, 'premium', ARRAY['Soul', 'Triana'], (SELECT id FROM public.cities WHERE name = 'Sevilla'), 4.6, 156),
  ('Premium Sevilla Gold', (SELECT id FROM public.restaurants WHERE name = 'Premium Sevilla'), 'Lo mejor de Sevilla', 6, 'premium', ARRAY['Gold', 'Premium'], (SELECT id FROM public.cities WHERE name = 'Sevilla'), 4.8, 178),
  ('The Scorcher', (SELECT id FROM public.restaurants WHERE name = 'The Scorcher Sevilla'), 'Muy picante y sabrosa', 7, 'premium', ARRAY['Picante', 'Fuego'], (SELECT id FROM public.cities WHERE name = 'Sevilla'), 4.5, 123),
  ('Craft Sevilla', (SELECT id FROM public.restaurants WHERE name = 'Sevilla Craft Burger'), 'Hecha a mano con pasión andaluza', 8, 'premium', ARRAY['Craft', 'Pasión'], (SELECT id FROM public.cities WHERE name = 'Sevilla'), 4.7, 167),

-- More Sevilla burgers
  ('Spain on a Plate', (SELECT id FROM public.restaurants WHERE name = 'Giralda Grill'), 'España en una hamburguesa', 9, 'premium', ARRAY['Española', 'Tradicional'], (SELECT id FROM public.cities WHERE name = 'Sevilla'), 4.6, 134),

-- BILBAO BURGERS
  ('Basque Country', (SELECT id FROM public.restaurants WHERE name = 'Basque Burger'), 'Ingredientes vascos locales', 1, 'premium', ARRAY['Vasco', 'Local'], (SELECT id FROM public.cities WHERE name = 'Bilbao'), 4.7, 198),
  ('Guggenheim', (SELECT id FROM public.restaurants WHERE name = 'Guggenheim Grill'), 'Arte moderno en una burger', 2, 'premium', ARRAY['Arte', 'Moderno'], (SELECT id FROM public.cities WHERE name = 'Bilbao'), 4.6, 167),
  ('Bilbao Soul', (SELECT id FROM public.restaurants WHERE name = 'Bilbao Burgers'), 'El alma de Bilbao', 3, 'premium', ARRAY['Soul', 'Bilbao'], (SELECT id FROM public.cities WHERE name = 'Bilbao'), 4.5, 145),
  ('Txoko Special', (SELECT id FROM public.restaurants WHERE name = 'Txoko Burger'), 'Especialidad del Txoko', 4, 'premium', ARRAY['Especial', 'Txoko'], (SELECT id FROM public.cities WHERE name = 'Bilbao'), 4.6, 156),
  ('Casco Viejo Wonder', (SELECT id FROM public.restaurants WHERE name = 'Casco Viejo Burger'), 'Maravilla del Casco Viejo', 5, 'premium', ARRAY['Medieval', 'Tradicional'], (SELECT id FROM public.cities WHERE name = 'Bilbao'), 4.7, 178),
  ('Artisan Bilbao Premium', (SELECT id FROM public.restaurants WHERE name = 'Artisan Bilbao'), 'Artesanía vasca premium', 6, 'premium', ARRAY['Artisanal', 'Premium'], (SELECT id FROM public.cities WHERE name = 'Bilbao'), 4.8, 145),
  ('Modern Coast', (SELECT id FROM public.restaurants WHERE name = 'Modern Burger Bilbao'), 'Moderna con sabor costero', 7, 'premium', ARRAY['Moderna', 'Costera'], (SELECT id FROM public.cities WHERE name = 'Bilbao'), 4.5, 123),
  ('Basque Excellence', (SELECT id FROM public.restaurants WHERE name = 'Premium Basque'), 'Excelencia vasca', 8, 'premium', ARRAY['Excelencia', 'Vasco'], (SELECT id FROM public.cities WHERE name = 'Bilbao'), 4.9, 189),

-- More Bilbao burgers
  ('Bilbao Triple Stack', (SELECT id FROM public.restaurants WHERE name = 'Basque Burger'), 'Tres carnes vascas apiladas', 9, 'doble', ARRAY['Triple', 'Vasco'], (SELECT id FROM public.cities WHERE name = 'Bilbao'), 4.7, 145),
  ('Coast to Coast', (SELECT id FROM public.restaurants WHERE name = 'Modern Burger Bilbao'), 'De la costa de Vizcaya', 10, 'premium', ARRAY['Costa', 'Fresco'], (SELECT id FROM public.cities WHERE name = 'Bilbao'), 4.6, 134);

-- ============================================================================
-- SAMPLE USERS (10 users for ratings)
-- ============================================================================

INSERT INTO public.users (id, username, email, bio, points, category, public_profile) VALUES
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, 'cristhian_guzman', 'cristhian@burgerank.com', 'Burger enthusiast desde el 2020', 450, 'Burger Obsessed', TRUE),
  ('550e8400-e29b-41d4-a716-446655440002'::uuid, 'elena_burger', 'elena@burgerank.com', 'Amante de las hamburguesas gourmet', 315, 'Burger Lover', TRUE),
  ('550e8400-e29b-41d4-a716-446655440003'::uuid, 'juan_fast', 'juan@burgerank.com', 'Probando todas las burgers del país', 620, 'Burger Obsessed', TRUE),
  ('550e8400-e29b-41d4-a716-446655440004'::uuid, 'maria_foodie', 'maria@burgerank.com', 'Critica de comida profesional', 520, 'Burger Obsessed', TRUE),
  ('550e8400-e29b-41d4-a716-446655440005'::uuid, 'alex_burger', 'alex@burgerank.com', 'Burger casual', 185, 'Burger Fan', TRUE),
  ('550e8400-e29b-41d4-a716-446655440006'::uuid, 'sophie_gourmet', 'sophie@burgerank.com', 'Buscando la burger perfecta', 380, 'Burger Lover', TRUE),
  ('550e8400-e29b-41d4-a716-446655440007'::uuid, 'carlos_master', 'carlos@burgerank.com', 'Master en burgers', 550, 'Burger Obsessed', TRUE),
  ('550e8400-e29b-41d4-a716-446655440008'::uuid, 'lucia_critic', 'lucia@burgerank.com', 'Crítica de burgers', 420, 'Burger Obsessed', TRUE),
  ('550e8400-e29b-41d4-a716-446655440009'::uuid, 'david_casual', 'david@burgerank.com', 'Casual burger lover', 125, 'Burger Fan', TRUE),
  ('550e8400-e29b-41d4-a716-446655440010'::uuid, 'nina_tracker', 'nina@burgerank.com', 'Tracking every burger', 280, 'Burger Lover', TRUE);

-- ============================================================================
-- SAMPLE RATINGS (80+ ratings distributed across burgers)
-- ============================================================================

INSERT INTO public.ratings (user_id, burger_id, overall_rating, pan_rating, carne_rating, toppings_rating, salsa_rating, price, comment, has_ticket, consumption_type, appetizers, points_awarded) VALUES
-- Ratings for The King Burger (Madrid)
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, (SELECT id FROM public.burgers WHERE name = 'The King Burger' LIMIT 1), 5, 3, 3, 3, 2, 12.50, 'Increíble, definitivamente la mejor burger que he probado', TRUE, 'local', ARRAY['fries', 'nachos'], 75),
  ('550e8400-e29b-41d4-a716-446655440002'::uuid, (SELECT id FROM public.burgers WHERE name = 'The King Burger' LIMIT 1), 5, 3, 3, 3, 3, 12.50, 'Perfecta en todos los aspectos', TRUE, 'local', ARRAY['fries'], 75),
  ('550e8400-e29b-41d4-a716-446655440003'::uuid, (SELECT id FROM public.burgers WHERE name = 'The King Burger' LIMIT 1), 4, 3, 3, 2, 3, 12.50, 'Muy buena, aunque el pan podría ser más crujiente', TRUE, 'local', ARRAY['rings'], 60),

-- Ratings for Smoky BBQ (Barcelona)
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, (SELECT id FROM public.burgers WHERE name = 'Smoky BBQ' LIMIT 1), 4, 2, 3, 3, 3, 11.00, 'La salsa BBQ es excepcional', TRUE, 'local', ARRAY['chicken'], 60),
  ('550e8400-e29b-41d4-a716-446655440004'::uuid, (SELECT id FROM public.burgers WHERE name = 'Smoky BBQ' LIMIT 1), 5, 3, 3, 3, 3, 11.00, 'La mejor que he probado en Barcelona', TRUE, 'local', ARRAY['fries'], 75),
  ('550e8400-e29b-41d4-a716-446655440005'::uuid, (SELECT id FROM public.burgers WHERE name = 'Smoky BBQ' LIMIT 1), 4, 2, 3, 3, 2, 11.00, 'Buena pero cara', FALSE, 'delivery', ARRAY['none'], 60),

-- Ratings for Clásica Tradicional (Valencia)
  ('550e8400-e29b-41d4-a716-446655440002'::uuid, (SELECT id FROM public.burgers WHERE name = 'Clásica Tradicional' LIMIT 1), 4, 3, 2, 3, 3, 9.50, 'Sorprendentemente deliciosa para una burger vegana', FALSE, 'delivery', ARRAY['none'], 50),
  ('550e8400-e29b-41d4-a716-446655440006'::uuid, (SELECT id FROM public.burgers WHERE name = 'Clásica Tradicional' LIMIT 1), 4, 3, 3, 3, 2, 9.50, 'La clásica, simple pero efectiva', TRUE, 'local', ARRAY['fries', 'nachos'], 60),

-- Ratings for Premium Gold (Madrid)
  ('550e8400-e29b-41d4-a716-446655440007'::uuid, (SELECT id FROM public.burgers WHERE name = 'Premium Gold' LIMIT 1), 5, 3, 3, 3, 3, 18.00, 'Lujo en forma de hamburguesa', TRUE, 'local', ARRAY['fries'], 75),
  ('550e8400-e29b-41d4-a716-446655440003'::uuid, (SELECT id FROM public.burgers WHERE name = 'Premium Gold' LIMIT 1), 5, 3, 3, 3, 3, 18.00, 'Wagyu perfecto', TRUE, 'local', ARRAY['nachos'], 75),

-- Ratings for Catalan Burger (Barcelona)
  ('550e8400-e29b-41d4-a716-446655440004'::uuid, (SELECT id FROM public.burgers WHERE name = 'Catalan Burger' LIMIT 1), 5, 3, 3, 3, 3, 13.50, 'El jamón ibérico le da un sabor único', TRUE, 'local', ARRAY['fries'], 75),
  ('550e8400-e29b-41d4-a716-446655440008'::uuid, (SELECT id FROM public.burgers WHERE name = 'Catalan Burger' LIMIT 1), 4, 3, 3, 3, 2, 13.50, 'Muy buena, representativa de Catalunya', TRUE, 'local', ARRAY['rings'], 60),

-- Ratings for Premium Paella Burger (Valencia)
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, (SELECT id FROM public.burgers WHERE name = 'Premium Paella Burger' LIMIT 1), 5, 3, 3, 3, 3, 14.00, 'Innovadora, el azafrán es perfecto', TRUE, 'local', ARRAY['fries'], 75),
  ('550e8400-e29b-41d4-a716-446655440009'::uuid, (SELECT id FROM public.burgers WHERE name = 'Premium Paella Burger' LIMIT 1), 4, 2, 3, 3, 3, 14.00, 'Interesante mezcla de sabores', FALSE, 'delivery', ARRAY['none'], 60),

-- Ratings for Basque Excellence (Bilbao)
  ('550e8400-e29b-41d4-a716-446655440003'::uuid, (SELECT id FROM public.burgers WHERE name = 'Basque Excellence' LIMIT 1), 5, 3, 3, 3, 3, 15.00, 'La mejor burger vasca', TRUE, 'local', ARRAY['fries', 'chicken'], 75),
  ('550e8400-e29b-41d4-a716-446655440010'::uuid, (SELECT id FROM public.burgers WHERE name = 'Basque Excellence' LIMIT 1), 5, 3, 3, 3, 3, 15.00, 'Excelencia pura', TRUE, 'local', ARRAY['nachos'], 75),

-- More distributed ratings
  ('550e8400-e29b-41d4-a716-446655440004'::uuid, (SELECT id FROM public.burgers WHERE name = 'Double Stack Madrid' LIMIT 1), 4, 3, 3, 2, 3, 11.50, 'Doble bien hecha', TRUE, 'local', ARRAY['fries'], 60),
  ('550e8400-e29b-41d4-a716-446655440005'::uuid, (SELECT id FROM public.burgers WHERE name = 'BBQ Master' LIMIT 1), 4, 2, 3, 3, 3, 11.00, 'La salsa es lo mejor', TRUE, 'local', ARRAY['rings'], 60),
  ('550e8400-e29b-41d4-a716-446655440006'::uuid, (SELECT id FROM public.burgers WHERE name = 'Green Supreme' LIMIT 1), 4, 3, 2, 3, 3, 10.50, 'Muy buena para vegana', FALSE, 'delivery', ARRAY['none'], 60),
  ('550e8400-e29b-41d4-a716-446655440007'::uuid, (SELECT id FROM public.burgers WHERE name = 'The Beast' LIMIT 1), 5, 3, 3, 3, 3, 14.00, 'Una bestia sabrosa', TRUE, 'local', ARRAY['fries', 'chicken', 'rings'], 75),
  ('550e8400-e29b-41d4-a716-446655440008'::uuid, (SELECT id FROM public.burgers WHERE name = 'Giralda Premium' LIMIT 1), 4, 3, 3, 3, 2, 12.50, 'Premium sevillano', TRUE, 'local', ARRAY['fries'], 60),
  ('550e8400-e29b-41d4-a716-446655440009'::uuid, (SELECT id FROM public.burgers WHERE name = 'Basque Country' LIMIT 1), 4, 2, 3, 3, 3, 12.00, 'Muy vasca', TRUE, 'local', ARRAY['rings'], 60),
  ('550e8400-e29b-41d4-a716-446655440010'::uuid, (SELECT id FROM public.burgers WHERE name = 'Guggenheim' LIMIT 1), 4, 3, 3, 2, 3, 13.00, 'Arte y sabor', TRUE, 'local', ARRAY['fries', 'nachos'], 60);

-- ============================================================================
-- SAMPLE USER BADGES (unlock achievements)
-- ============================================================================

INSERT INTO public.user_badges (user_id, badge_id, unlocked_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, (SELECT id FROM public.badges WHERE name = 'Primer Rating'), NOW() - INTERVAL '6 months'),
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, (SELECT id FROM public.badges WHERE name = 'Crítico Ardiente'), NOW() - INTERVAL '4 months'),
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, (SELECT id FROM public.badges WHERE name = 'Maestro de Sabores'), NOW() - INTERVAL '2 months'),
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, (SELECT id FROM public.badges WHERE name = 'Coleccionista'), NOW() - INTERVAL '1 month'),
  ('550e8400-e29b-41d4-a716-446655440003'::uuid, (SELECT id FROM public.badges WHERE name = 'Crítico Leyenda'), NOW()),
  ('550e8400-e29b-41d4-a716-446655440003'::uuid, (SELECT id FROM public.badges WHERE name = 'Coleccionista'), NOW() - INTERVAL '2 weeks'),
  ('550e8400-e29b-41d4-a716-446655440004'::uuid, (SELECT id FROM public.badges WHERE name = 'Maestro de Sabores'), NOW() - INTERVAL '3 weeks'),
  ('550e8400-e29b-41d4-a716-446655440007'::uuid, (SELECT id FROM public.badges WHERE name = 'Crítico Leyenda'), NOW() - INTERVAL '1 week'),
  ('550e8400-e29b-41d4-a716-446655440008'::uuid, (SELECT id FROM public.badges WHERE name = 'Coleccionista'), NOW() - INTERVAL '10 days');

-- ============================================================================
-- SAMPLE USER REWARDS
-- ============================================================================

INSERT INTO public.user_rewards (user_id, reward_id, created_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, (SELECT id FROM public.rewards WHERE name = '10% Descuento'), NOW() - INTERVAL '1 month'),
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, (SELECT id FROM public.rewards WHERE name = 'Bebida Gratis'), NOW() - INTERVAL '2 weeks'),
  ('550e8400-e29b-41d4-a716-446655440003'::uuid, (SELECT id FROM public.rewards WHERE name = 'Hamburguesa Gratis'), NOW()),
  ('550e8400-e29b-41d4-a716-446655440004'::uuid, (SELECT id FROM public.rewards WHERE name = '50% Descuento'), NOW() - INTERVAL '5 days'),
  ('550e8400-e29b-41d4-a716-446655440007'::uuid, (SELECT id FROM public.rewards WHERE name = 'Aperitivo Gratis'), NOW() - INTERVAL '3 days');

-- ============================================================================
-- SAMPLE NOTIFICATIONS
-- ============================================================================

INSERT INTO public.notifications (user_id, title, description, type, icon_emoji, is_read) VALUES
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, '¡Subiste de nivel!', 'Alcanzaste Burger Obsessed', 'level_up', '⬆️', FALSE),
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, 'Nueva recompensa desbloqueada', 'Crítico Ardiente - Valora 10 burgers', 'badge_unlocked', '🎁', FALSE),
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, 'Nueva hamburguesa agregada', 'The Inferno en Fast Burger', 'new_burger', '🍔', TRUE),
  ('550e8400-e29b-41d4-a716-446655440003'::uuid, '¡Alcanzaste el top 1!', 'Eres crítico de burgers #1', 'achievement', '🏆', FALSE),
  ('550e8400-e29b-41d4-a716-446655440004'::uuid, 'Nueva burger en Barcelona', 'Catalan Burger en Grill House', 'new_burger', '🍔', FALSE);
