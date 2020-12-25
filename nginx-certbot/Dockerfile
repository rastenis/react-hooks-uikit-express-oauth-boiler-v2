FROM staticfloat/nginx-certbot
COPY *.conf /etc/nginx/conf.d/

ARG BOILER_DOMAIN
ARG OPENAUTHENTICATOR_DOMAIN

RUN sed -i "s/DOMAIN/${BOILER_DOMAIN}/g" /etc/nginx/conf.d/boiler.conf
RUN sed -i "s/DOMAIN/${OPENAUTHENTICATOR_DOMAIN}/g" /etc/nginx/conf.d/openauthenticator.conf
