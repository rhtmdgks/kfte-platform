-- Align blog-thumbnails bucket with app 15MB thumbnail limit
update storage.buckets
set file_size_limit = 15728640
where id = 'blog-thumbnails';
