FROM php:8.1.0-fpm

# Copy wait-for-it script
COPY wait-for-it.sh /usr/bin/wait-for-it

# Make wait-for-it script executable
RUN chmod +x /usr/bin/wait-for-it

# Install dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends libssl-dev zlib1g-dev curl git unzip netcat libxml2-dev libpq-dev libzip-dev && \
    pecl install apcu && \
    docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql && \
    docker-php-ext-install -j$(nproc) zip opcache intl pdo_pgsql pgsql && \
    docker-php-ext-enable apcu pdo_pgsql sodium && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Copy Composer binary from Composer image
COPY --from=composer /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Command to install dependencies, wait for database, and run PHP-FPM
CMD composer i -o ; wait-for-it db:5432 -- bin/console doctrine:migrations:migrate ; php-fpm 

# Expose port 9000
EXPOSE 9000
