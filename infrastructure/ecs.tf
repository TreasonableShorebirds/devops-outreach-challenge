#
# ECS configuration for apprentice-outreach
#

resource "aws_ecs_cluster" "main" {
  name = "apprentice-outreach-cluster"
}

data "aws_caller_identity" "current" {}

data "aws_iam_role" "ecs_task_execution" {
  name = "ecsTaskExecutionRole"
}

resource "aws_ecs_task_definition" "apprentice-outreach" {
  family                   = "apprentice-outreach"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "${var.fargate_cpu}"
  memory                   = "${var.fargate_memory}"
  execution_role_arn       = "${data.aws_iam_role.ecs_task_execution.arn}"

  container_definitions = <<DEFINITION
  [
    {
      "cpu": ${var.fargate_cpu},
      "environment": [{
        "name": "botHostname",
        "value": "${var.app_host}.${var.domain}"
      }],
      "executionRoleArn": "${data.aws_iam_role.ecs_task_execution.arn}",
      "image": "${var.app_image}",
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "Apprentice-Outreach",
          "awslogs-region": "${var.aws_region}",
          "awslogs-stream-prefix": "apprentice-outreach"
        }
      },
      "memory": ${var.fargate_memory},
      "name": "apprentice-outreach",
      "networkMode": "awsvpc",
      "portMappings": [
        {
          "containerPort": ${var.app_port},
          "hostPort": ${var.app_port}
        }
      ],
    }
  ]
  DEFINITION

  #container_definitions = <<DEFINITION
  #[
  #  {
  #    "cpu": ${var.fargate_cpu},
  #    "environment": [{
  #      "name": "botHostname",
  #      "value": "${var.app_host}.${var.domain}"
  #    }],
  #    "executionRoleArn": "${data.aws_iam_role.ecs_task_execution.arn}",
  #    "image": "${var.app_image}",
  #    "logConfiguration": {
  #      "logDriver": "awslogs",
  #      "options": {
  #        "awslogs-group": "Apprentice-Outreach",
  #        "awslogs-region": "${var.aws_region}",
  #        "awslogs-stream-prefix": "apprentice-outreach"
  #      }
  #    },
  #    "memory": ${var.fargate_memory},
  #    "name": "apprentice-outreach",
  #    "networkMode": "awsvpc",
  #    "portMappings": [
  #      {
  #        "containerPort": ${var.app_port},
  #        "hostPort": ${var.app_port}
  #      }
  #    ],
  #    "secrets": [
  #      {
  #        "name": "mongodbUri",
  #        "valueFrom": "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/apprentice-outreach-mongodb-string"
  #      }
  #    ]
  #  }
  #]
  #DEFINITION
}

resource "aws_ecs_service" "main" {
  name            = "apprentice-outreach-service"
  cluster         = "${aws_ecs_cluster.main.id}"
  task_definition = "${aws_ecs_task_definition.apprentice-outreach.arn}"
  desired_count   = "${var.app_count}"
  launch_type     = "FARGATE"

  network_configuration {
    security_groups = ["${aws_security_group.ecs_tasks.id}"]
    subnets         = ["${aws_subnet.private.*.id}"]
  }

  load_balancer {
    target_group_arn = "${aws_alb_target_group.app.id}"
    container_name   = "apprentice-outreach"
    container_port   = "${var.app_port}"
  }

  depends_on = [
    "aws_alb_listener.front_end",
  ]
}
