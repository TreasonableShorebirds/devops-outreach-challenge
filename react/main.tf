provider "aws" {
  region = "us-west-2"
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
  ingress {
    from_port = 3000 
    to_port = 3000 
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
  ami = "ami-0cb72367e98845d43"
  instance_type = "t2.micro"
  key_name = "seanj"
  vpc_security_group_ids = ["${aws_security_group.websg.id}"]
  tags{
    Name = "apprentice-outreach-instruction-application"
  }
  user_data = <<-EOF
    #!/bin/bash
    sudo yum update -y
    sudo yum install -y git 
    sudo yum install yarn git -y
    sudo amazon-linux-extras install docker
    sudo service docker start
    sudo curl -L "https://github.com/docker/compose/releases/download/1.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    git clone https://github.com/liatrio/apprentice-outreach-instruction-application.git
    cd apprentice-outreach-instruction-application
    docker-compose up -d
    EOF
}

