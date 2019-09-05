resource "aws_security_group" "outreach-cluster" {
  name        = "apprentice-outreach-cluster"
  description = "Cluster communication with worker nodes"
  vpc_id      = "${aws_vpc.outreach.id}"

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "apprentice-outreach"
  }
}
