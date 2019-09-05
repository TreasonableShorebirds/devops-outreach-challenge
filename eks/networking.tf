data "aws_availability_zones" "available" {}

resource "aws_vpc" "outreach" {
  cidr_block = "10.0.0.0/16"

  tags = "${
    map(
     "Name", "apprentice-outreach-node",
     "kubernetes.io/cluster/${var.cluster-name}", "shared",
    )
  }"
}

resource "aws_subnet" "outreach" {
  count = 2

  availability_zone = "${data.aws_availability_zones.available.names[count.index]}"
  cidr_block        = "10.0.${count.index}.0/24"
  vpc_id            = "${aws_vpc.outreach.id}"

  tags = "${
    map(
     "Name", "apprentice-outreach-node",
     "kubernetes.io/cluster/${var.cluster-name}", "shared",
    )
  }"
}

resource "aws_internet_gateway" "outreach" {
  vpc_id = "${aws_vpc.outreach.id}"

  tags = {
    Name = "apprentice-outreach"
  }
}

resource "aws_route_table" "outreach" {
  vpc_id = "${aws_vpc.outreach.id}"

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = "${aws_internet_gateway.outreach.id}"
  }
}

resource "aws_route_table_association" "outreach" {
  count = 2

  subnet_id      = "${aws_subnet.outreach.*.id[count.index]}"
  route_table_id = "${aws_route_table.outreach.id}"
}
