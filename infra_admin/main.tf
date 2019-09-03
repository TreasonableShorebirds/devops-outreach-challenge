terraform {
  backend "s3" {
    bucket = "apprentice-outreach-tfstates"
    key    = "state/apprentice-outreach-admin.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = "${var.aws_region}"
}

resource "aws_kms_key" "apprentice-outreach" {
  description             = "apprentice-outreach resource key"
  deletion_window_in_days = 21
}

resource "aws_kms_alias" "apprentice-outreach" {
  name          = "alias/apprentice-outreach"
  target_key_id = "${aws_kms_key.apprentice-outreach.id}"
}

#resource "aws_ssm_parameter" "mongo_db_string" {
#  name        = "gratibot-mongodb-string"
#  description = "mongo db instance for the gratibot app"
#  key_id      = "${aws_kms_key.gratibot.key_id}"
#  value       = "${var.mongo_db_string}"
#  type        = "SecureString"
#}

resource "aws_iam_role" "ecs_task_execution" {
  name = "ecsTaskExecutionRole"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "ecs_task_policy" {
  name = "ecs_task_policy"
  role = "${aws_iam_role.ecs_task_execution.id}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "ssm:GetParameters",
        "kms:Decrypt"
      ],
      "Resource": "*"
    }
  ]
}
EOF
}
