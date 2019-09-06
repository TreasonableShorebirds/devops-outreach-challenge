#
# variables for apprentice-outreach
#

variable "aws_region" {
  description = "The AWS region to create things in."
  default     = "us-east-1"
}

variable "az_count" {
  description = "Number of AZs to cover in a given AWS region"
  default     = "2"
}

variable "app_image" {
  description = "Docker image to run in the ECS cluster"
  default     = "docker.artifactory.liatr.io/liatrio/apprentice-outreach-instruction-application_react:latest"
}

variable "node_image" {
  description = "Docker image to run in the ECS cluster"
  default     = "docker.artifactory.liatr.io/liatrio/apprentice-outreach-instruction-application_node:f325607b8bad"
}

variable "app_port" {
  description = "Port exposed by the docker image to redirect traffic to"
  default     = 3000
}

variable "db_port" {
  description = "Port exposed by the docker image to access the database"
  default     = 27017 
}

variable "node_port" {
  description = "Port exposed by the docker image to access the database"
  default     = 3001
}

variable "app_count" {
  description = "Number of docker containers to run"
  default     = 1
}

variable "fargate_cpu" {
  description = "Fargate instance CPU units to provision (1 vCPU = 1024 CPU units)"
  default     = "256"
}

variable "fargate_memory" {
  description = "Fargate instance memory to provision (in MiB)"
  default     = "512"
}

variable "domain" {
  description = "Domain to be used on the ALB for the bot"
}

variable "app_host" {
  description = "DNS hostname"
}
