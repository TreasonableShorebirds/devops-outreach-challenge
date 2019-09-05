#
# set up load balancing for gratibot
# 

resource "aws_alb" "main" {
  name            = "tf-ecs-chat"
  subnets         = "${aws_subnet.public.*.id}"
  security_groups = ["${aws_security_group.lb.id}"]
}

resource "aws_alb_target_group" "app" {
  name        = "tf-ecs-chat"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = "${aws_vpc.main.id}"
  target_type = "ip"
}

resource "aws_alb_listener" "front_end" {
  load_balancer_arn = "${aws_alb.main.id}"
  port              = "80"
  protocol          = "HTTP"

  default_action {
    target_group_arn = "${aws_alb_target_group.app.id}"
    type             = "forward"
  }
}

resource "aws_alb_target_group" "node" {
  name        = "tf-ecs-chat"
  port        = "${var.node_port}" 
  protocol    = "HTTP"
  vpc_id      = "${aws_vpc.main.id}"
  target_type = "ip"
}

resource "aws_alb_listener" "back_end" {
  load_balancer_arn = "${aws_alb.main.id}"
  port              = "${var.node_port}"
  protocol          = "HTTP"

  default_action {
    target_group_arn = "${aws_alb_target_group.node.id}"
    type             = "forward"
  }
}
