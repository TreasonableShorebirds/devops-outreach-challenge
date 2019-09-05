resource "aws_eks_cluster" "apprentice-outreach" {
  name            = "${var.cluster-name}"
  role_arn        = "${aws_iam_role.outreach-cluster.arn}"

  vpc_config {
    security_group_ids = ["${aws_security_group.outreach-cluster.id}"]
    subnet_ids         = "${aws_subnet.outreach.*.id}"
  }

  depends_on = [
    "aws_iam_role_policy_attachment.outreach-cluster-AmazonEKSClusterPolicy",
    "aws_iam_role_policy_attachment.outreach-cluster-AmazonEKSServicePolicy",
  ]
}
