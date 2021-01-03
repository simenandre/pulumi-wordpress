FROM alpine as core-plugins

WORKDIR /plugins

RUN apk add -U unzip && rm -rf /var/cache/apk/*

RUN wget -O /tmp/wp-stateless.zip https://github.com/udx/wp-stateless/archive/3.1.1.zip
RUN ls /tmp/
RUN unzip /tmp/wp-stateless.zip -d /tmp/wp-stateless
RUN mv /tmp/wp-stateless/* /plugins

FROM wordpress:latest

# Configure PHP for Cloud Run.
# Precompile PHP code with opcache.
RUN docker-php-ext-install -j "$(nproc)" opcache
RUN set -ex; \
  { \
  echo "; Cloud Run enforces memory & timeouts"; \
  echo "memory_limit = -1"; \
  echo "max_execution_time = 0"; \
  echo "; File upload at Cloud Run network limit"; \
  echo "upload_max_filesize = 32M"; \
  echo "post_max_size = 32M"; \
  echo "; Configure Opcache for Containers"; \
  echo "opcache.enable = On"; \
  echo "opcache.validate_timestamps = Off"; \
  echo "; Configure Opcache Memory (Application-specific)"; \
  echo "opcache.memory_consumption = 32"; \
  } > "$PHP_INI_DIR/conf.d/cloud-run.ini"

# Copy in custom code from the host machine.
WORKDIR /var/www/html

COPY --from=core-plugins /plugins /usr/src/wordpress/wp-content/plugins

ENV WORDPRESS_CONFIG_EXTRA \
  define('WP_STATELESS_MEDIA_MODE', 'stateless'); \
  define('WP_STATELESS_MEDIA_HIDE_SETUP_ASSISTANT', true); \
  define('WP_STATELESS_MEDIA_BUCKET', getenv('STORAGE_BUCKET')); \
  define('WP_STATELESS_MEDIA_KEY_FILE_PATH', getenv('GOOGLE_APPLICATION_CREDENTIALS')); \
  define('WP_STATELESS_CONSOLE_LOG', true); \
  define('DISALLOW_FILE_MODS', true); \
  define('AUTOMATIC_UPDATER_DISABLED', true);


# COPY . ./

# Use the PORT environment variable in Apache configuration files.
# https://cloud.google.com/run/docs/reference/container-contract#port
RUN sed -i 's/80/${PORT}/g' /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

# Configure PHP for development.
# Switch to the production php.ini for production operations.
# RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"
# https://github.com/docker-library/docs/blob/master/php/README.md#configuration
RUN mv "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini"