DELETE FROM flights;

INSERT INTO flights (flight_number, origin, destination, departure_time, arrival_time, seats_remaining, price) VALUES
('FR1001', 'ARN', 'CDG', CURRENT_DATE + INTERVAL '1 day' + INTERVAL '8 hours',  CURRENT_DATE + INTERVAL '1 day' + INTERVAL '10 hours 20 minutes', 140, 1890.00),
('FR1002', 'ARN', 'CDG', CURRENT_DATE + INTERVAL '1 day' + INTERVAL '14 hours', CURRENT_DATE + INTERVAL '1 day' + INTERVAL '16 hours 20 minutes', 140, 1750.00),
('FR1003', 'CDG', 'JFK', CURRENT_DATE + INTERVAL '1 day' + INTERVAL '8 hours',  CURRENT_DATE + INTERVAL '1 day' + INTERVAL '16 hours 45 minutes', 220, 5380.00),
('FR1004', 'CDG', 'JFK', CURRENT_DATE + INTERVAL '1 day' + INTERVAL '14 hours', CURRENT_DATE + INTERVAL '1 day' + INTERVAL '22 hours 45 minutes', 220, 5120.00),
('FR1005', 'JFK', 'HND', CURRENT_DATE + INTERVAL '1 day' + INTERVAL '8 hours',  CURRENT_DATE + INTERVAL '2 days' + INTERVAL '3 hours 30 minutes', 250, 8450.00),
('FR1006', 'JFK', 'HND', CURRENT_DATE + INTERVAL '1 day' + INTERVAL '14 hours', CURRENT_DATE + INTERVAL '2 days' + INTERVAL '9 hours 30 minutes', 250, 8900.00),
('FR1007', 'HND', 'SYD', CURRENT_DATE + INTERVAL '1 day' + INTERVAL '8 hours',  CURRENT_DATE + INTERVAL '1 day' + INTERVAL '17 hours 40 minutes', 180, 6450.00),
('FR1008', 'HND', 'SYD', CURRENT_DATE + INTERVAL '1 day' + INTERVAL '14 hours', CURRENT_DATE + INTERVAL '1 day' + INTERVAL '23 hours 40 minutes', 180, 6890.00),
('FR1009', 'SYD', 'ARN', CURRENT_DATE + INTERVAL '1 day' + INTERVAL '8 hours',  CURRENT_DATE + INTERVAL '2 days' + INTERVAL '10 hours 10 minutes', 160, 9990.00),
('FR1010', 'SYD', 'ARN', CURRENT_DATE + INTERVAL '1 day' + INTERVAL '14 hours', CURRENT_DATE + INTERVAL '2 days' + INTERVAL '16 hours 10 minutes', 160, 9450.00),
('FR1011', 'ARN', 'CDG', CURRENT_DATE + INTERVAL '2 days' + INTERVAL '8 hours',  CURRENT_DATE + INTERVAL '2 days' + INTERVAL '10 hours 20 minutes', 140, 1890.00),
('FR1012', 'ARN', 'CDG', CURRENT_DATE + INTERVAL '2 days' + INTERVAL '14 hours', CURRENT_DATE + INTERVAL '2 days' + INTERVAL '16 hours 20 minutes', 140, 1750.00),
('FR1013', 'CDG', 'JFK', CURRENT_DATE + INTERVAL '2 days' + INTERVAL '8 hours',  CURRENT_DATE + INTERVAL '2 days' + INTERVAL '16 hours 45 minutes', 220, 5380.00),
('FR1014', 'CDG', 'JFK', CURRENT_DATE + INTERVAL '2 days' + INTERVAL '14 hours', CURRENT_DATE + INTERVAL '2 days' + INTERVAL '22 hours 45 minutes', 220, 5120.00),
('FR1015', 'JFK', 'HND', CURRENT_DATE + INTERVAL '2 days' + INTERVAL '8 hours',  CURRENT_DATE + INTERVAL '3 days' + INTERVAL '3 hours 30 minutes', 250, 8450.00),
('FR1016', 'JFK', 'HND', CURRENT_DATE + INTERVAL '2 days' + INTERVAL '14 hours', CURRENT_DATE + INTERVAL '3 days' + INTERVAL '9 hours 30 minutes', 250, 8900.00),
('FR1017', 'HND', 'SYD', CURRENT_DATE + INTERVAL '2 days' + INTERVAL '8 hours',  CURRENT_DATE + INTERVAL '2 days' + INTERVAL '17 hours 40 minutes', 180, 6450.00),
('FR1018', 'HND', 'SYD', CURRENT_DATE + INTERVAL '2 days' + INTERVAL '14 hours', CURRENT_DATE + INTERVAL '2 days' + INTERVAL '23 hours 40 minutes', 180, 6890.00),
('FR1019', 'SYD', 'ARN', CURRENT_DATE + INTERVAL '2 days' + INTERVAL '8 hours',  CURRENT_DATE + INTERVAL '3 days' + INTERVAL '10 hours 10 minutes', 160, 9990.00),
('FR1020', 'SYD', 'ARN', CURRENT_DATE + INTERVAL '2 days' + INTERVAL '14 hours', CURRENT_DATE + INTERVAL '3 days' + INTERVAL '16 hours 10 minutes', 160, 9450.00);
