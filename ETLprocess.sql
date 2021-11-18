copy public.reviews (id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) FROM '/Users/oceanli/Downloads/data/reviews.csv' DELIMITER ',' CSV HEADER ENCODING 'UTF8' QUOTE '\"' ESCAPE '''';


copy public.reviews_photos (id, review_id, url) FROM '/Users/oceanli/Downloads/data/reviews_photos.csv' DELIMITER ',' CSV HEADER ENCODING 'UTF8' QUOTE '\"' ESCAPE '''';

