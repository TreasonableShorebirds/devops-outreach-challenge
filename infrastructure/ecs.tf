#
# ECS configuration for apprentice-outreach
#



## Create another task definition for node

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
        "name": "REACT_APP_IP",
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
          "hostPort": 80 
        }
      ]
    }
  ]
  DEFINITION
}


resource "aws_ecs_task_definition" "outreach-mongodb" {
  family                   = "outreach-mongodb"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "${var.fargate_cpu}"
  memory                   = "${var.fargate_memory}"
  execution_role_arn       = "${data.aws_iam_role.ecs_task_execution.arn}"

  container_definitions = <<DEFINITION
  [
    {
      "cpu": ${var.fargate_cpu},
      "executionRoleArn": "${data.aws_iam_role.ecs_task_execution.arn}",
      "image": "mongo:3.6",
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "outreach-mongodb",
          "awslogs-region": "${var.aws_region}",
          "awslogs-stream-prefix": "outreach-mongodb"
        }
      },
      "memory": ${var.fargate_memory},
      "name": "outreach-mongodb",
      "networkMode": "awsvpc",
      "portMappings": [
        {
          "containerPort": ${var.db_port},
          "hostPort": ${var.db_port} 
        }
      ]
    }
  ]
  DEFINITION
}

resource "aws_ecs_task_definition" "outreach-node" {
  family                   = "outreach-node"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "${var.fargate_cpu}"
  memory                   = "${var.fargate_memory}"
  execution_role_arn       = "${data.aws_iam_role.ecs_task_execution.arn}"

  container_definitions = <<DEFINITION
  [
    {
      "cpu": ${var.fargate_cpu},
      "executionRoleArn": "${data.aws_iam_role.ecs_task_execution.arn}",
      "image": "${var.node_image}",
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "outreach-node",
          "awslogs-region": "${var.aws_region}",
          "awslogs-stream-prefix": "outreach-node"
        }
      },
      "memory": ${var.fargate_memory},
      "name": "outreach-node",
      "networkMode": "awsvpc",
      "portMappings": [
        {
          "containerPort": ${var.node_port},
          "hostPort": ${var.node_port} 
        }
      ]
    }
  ]
  DEFINITION
}

resource "aws_ecs_service" "main" {
  name            = "apprentice-outreach-service"
  cluster         = "${aws_ecs_cluster.main.id}"
  task_definition = "${aws_ecs_task_definition.apprentice-outreach.arn}"
  desired_count   = "${var.app_count}"
  launch_type     = "FARGATE"

  network_configuration {
    security_groups = ["${aws_security_group.ecs_tasks.id}"]
    subnets         = "${aws_subnet.private.*.id}"
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

### Would make mongodb available at mongodb.liatr.io??
resource "aws_service_discovery_service" "mongodb" {
  name = "mongodb"
  dns_config {
    namespace_id = "${var.domain}"
    routing_policy = "MULTIVALUE"
    dns_records {
      ttl = 10
      type = "A"
    }

    dns_records {
      ttl  = 10
      type = "SRV"
    }
  }
  health_check_custom_config {
    failure_threshold = 5
  }
}

resource "aws_ecs_service" "mongodb-service" {
  name            = "mongodb-service"
  cluster         = "${aws_ecs_cluster.main.id}"
  task_definition = "${aws_ecs_task_definition.outreach-mongodb.arn}"
  desired_count   = "${var.app_count}"
  launch_type     = "FARGATE"

  network_configuration {
    security_groups = ["${aws_security_group.ecs_tasks.id}"]
    subnets         = "${aws_subnet.private.*.id}"
  }

  # Allow the service to be accessible through service discovery
  service_registries {
    registry_arn = "${aws_service_discovery_service.mongodb.arn}"
    port = "${var.db_port}"
  }

### Don't think this is necessary
  depends_on = [
    "aws_alb_listener.front_end",
  ]
}


#resource "aws_service_discovery_service" "node" {
#  name = "node"
#  dns_config {
#    namespace_id = "${var.domain}"
#    routing_policy = "MULTIVALUE"
#    dns_records {
#      ttl = 10
#      type = "A"
#    }
#
#    dns_records {
#      ttl  = 10
#      type = "SRV"
#    }
#  }
#  health_check_custom_config {
#    failure_threshold = 5
#  }
#}

resource "aws_ecs_service" "node-service" {
  name            = "node-service"
  cluster         = "${aws_ecs_cluster.main.id}"
  task_definition = "${aws_ecs_task_definition.outreach-node.arn}"
  desired_count   = "${var.app_count}"
  launch_type     = "FARGATE"

  network_configuration {
    security_groups = ["${aws_security_group.ecs_tasks.id}"]
    subnets         = "${aws_subnet.private.*.id}"
  }

  load_balancer {
    target_group_arn = "${aws_alb_target_group.node.id}"
    container_name   = "outreach-node"
    container_port   = "${var.node_port}"
  }

  depends_on = [
    "aws_alb_listener.back_end",
  ]
}
