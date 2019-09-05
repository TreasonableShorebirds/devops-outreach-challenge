terraform {
  backend "s3" {
    bucket = "slackbots-tfstates"
    key    = "state/apprentice-outreach.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = "${var.aws_region}"
}
