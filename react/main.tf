provider "aws" {
  region = "us-east-1"
}

resource "aws_security_group" "websg" {
  name ="terraform-webserver-websg"
  ingress {
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "webserver"{
  ami = "ami-011b3ccf1bd6db744"
  instance_type = "t2.micro"
  key_name = "takumin"
  vpc_security_group_ids = ["${aws_security_group.websg.id}"]
  tags{
    Name = "devops-challenge"
  }
  user_data = <<-EOF
    #!/bin/bash
    sudo yum install curl -y
    curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo
    curl --silent --location https://rpm.nodesource.com/setup_8.x | sudo bash -
    sudo yum install yarn git -y
    git clone https://github.com/liatrio/devops-challenge
    cd devops-challenge
    yarn install
    yarn build
    yarn global add serve
    serve -s build -l 80
    EOF
}

