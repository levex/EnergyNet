FROM parity/parity:stable
WORKDIR /build

COPY res/* res/

EXPOSE 30303 8545 8546 8180

ENTRYPOINT /parity/parity --config res/config.toml
