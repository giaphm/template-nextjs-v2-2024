.PHONY: build-development
build-development:
	docker compose -f docker/development/docker-compose.yml build

.PHONY: start-development
start-development:
	docker compose -f docker/development/docker-compose.yml up -d

.PHONY: stop-development
stop-development:
	docker compose -f docker/development/docker-compose.yml down


.PHONY: build-staging
build-staging:
	docker compose -f docker/staging/docker-compose.yml build

.PHONY: start-staging
start-staging:
	docker compose -f docker/staging/docker-compose.yml up -d

.PHONY: stop-staging
stop-staging:
	docker compose -f docker/staging/docker-compose.yml down


.PHONY: build-production
build-production:
	docker compose -f docker/production/docker-compose.yml build

.PHONY: start-production
start-production:
	docker compose -f docker/production/docker-compose.yml up -d

.PHONY: stop-production
stop-production:
	docker compose -f docker/production/docker-compose.yml down