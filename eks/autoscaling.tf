data "aws_ami" "eks-worker" {
  filter {
    name   = "name"
    values = ["amazon-eks-node-${aws_eks_cluster.apprentice-outreach.version}-v*"]
  }

  most_recent = true
  owners      = ["602401143452"] # Amazon EKS AMI Account ID
}
data "aws_region" "current" {}

locals {
  apprentice-outreach-node-userdata = <<USERDATA
#!/bin/bash
set -o xtrace
/etc/eks/bootstrap.sh --apiserver-endpoint '${aws_eks_cluster.apprentice-outreach.endpoint}' --b64-cluster-ca '${aws_eks_cluster.apprentice-outreach.certificate_authority.0.data}' '${var.cluster-name}'
USERDATA
}

resource "aws_launch_configuration" "apprentice-outreach" {
  associate_public_ip_address = true
  iam_instance_profile        = "${aws_iam_instance_profile.apprentice-outreach-node.name}"
  image_id                    = "${data.aws_ami.eks-worker.id}"
  instance_type               = "m4.large"
  name_prefix                 = "terraform-eks-apprentice-outreach"
  security_groups             = ["${aws_security_group.apprentice-outreach-node.id}"]
  user_data_base64            = "${base64encode(local.apprentice-outreach-node-userdata)}"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_autoscaling_group" "apprentice-outreach" {
  desired_capacity     = 1
  launch_configuration = "${aws_launch_configuration.apprentice-outreach.id}"
  max_size             = 1
  min_size             = 1
  name                 = "terraform-eks-apprentice-outreach"
  vpc_zone_identifier  = "${aws_subnet.outreach.*.id}"

  tag {
    key                 = "Name"
    value               = "terraform-eks-apprentice-outreach"
    propagate_at_launch = true
  }

  tag {
    key                 = "kubernetes.io/cluster/${var.cluster-name}"
    value               = "owned"
    propagate_at_launch = true
  }
}

