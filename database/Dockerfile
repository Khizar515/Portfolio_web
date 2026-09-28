FROM mysql:8.0

# Copy initialization script
COPY init.sql /docker-entrypoint-initdb.d/

# Set default auth plugin if needed for compatibility
CMD ["--default-authentication-plugin=mysql_native_password"]
