### Deploy EKS Cluster With Worker Nodes


Initialize Terraform
```
terraform init
```

Deploy EKS Cluster With Worker Nodes
```
terraform apply
```


After terraform apply is complete, connect to the cluster.
```
aws eks update-kubeconfig --name apprentice-outreach
```

## Allow Worker Nodes To Join Cluster

Terraform will output configuration based on `config_map_aws_auth.tf`.
Copy the output into a file called `config_map_aws_auth.yaml`. Then apply the config-map to the cluster.
```
kubectl apply -f config_map_aws_auth.yaml
```

Verify that worker nodes are being added to the cluster
```
kubectl get nodes --watch
```
