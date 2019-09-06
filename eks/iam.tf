resource "aws_iam_role" "outreach-cluster" {
  name = "apprentice-outreach"

  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "eks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
POLICY
}

resource "aws_iam_role_policy_attachment" "outreach-cluster-AmazonEKSClusterPolicy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = "${aws_iam_role.outreach-cluster.name}"
}

resource "aws_iam_role_policy_attachment" "outreach-cluster-AmazonEKSServicePolicy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSServicePolicy"
  role       = "${aws_iam_role.outreach-cluster.name}"
}

### Worker Node IAM Role and Instance Profile

resource "aws_iam_role" "apprentice-outreach-node" {
  name = "terraform-eks-apprentice-outreach-node"

  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
POLICY
}

resource "aws_iam_role_policy_attachment" "apprentice-outreach-node-AmazonEKSWorkerNodePolicy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = "${aws_iam_role.apprentice-outreach-node.name}"
}

resource "aws_iam_role_policy_attachment" "apprentice-outreach-node-AmazonEKS_CNI_Policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = "${aws_iam_role.apprentice-outreach-node.name}"
}

resource "aws_iam_role_policy_attachment" "apprentice-outreach-node-AmazonEC2ContainerRegistryReadOnly" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = "${aws_iam_role.apprentice-outreach-node.name}"
}

resource "aws_iam_instance_profile" "apprentice-outreach-node" {
  name = "terraform-eks-apprentice-outreach"
  role = "${aws_iam_role.apprentice-outreach-node.name}"
}

