# Phase 14: Monitoring and Logging (Free on Kind)

**Goal:** know the app is broken before users tell you.

| Tool | Job |
|---|---|
| Prometheus | Collects metrics (numbers) |
| Grafana | Dashboards |
| Alertmanager | Sends alerts |
| Loki | Stores logs |
| Alloy | Collects logs (replaced Promtail) |
| CloudWatch | AWS metrics and logs |

This is heavy. Give Docker at least 8 GB memory. WSL uses half of your RAM by default, which is enough on your laptop.

## Step 1: Prometheus + Grafana + Alertmanager

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install mon prometheus-community/kube-prometheus-stack -n monitoring --create-namespace
kubectl get pods -n monitoring -w
```

## Step 2: Open Grafana

```bash
kubectl get secret -n monitoring mon-grafana -o jsonpath='{.data.admin-password}' | base64 -d; echo
kubectl port-forward -n monitoring svc/mon-grafana 3000:80
```

Open http://localhost:3000, user `admin`. Look at the dashboards **Kubernetes / Compute Resources / Namespace (Pods)** for `lab`.

## Step 3: First queries

In Grafana → Explore → Prometheus:

```promql
sum by (pod) (rate(container_cpu_usage_seconds_total{namespace="lab"}[5m]))
sum by (pod) (container_memory_working_set_bytes{namespace="lab"})
kube_deployment_status_replicas_available{namespace="lab"}
increase(kube_pod_container_status_restarts_total{namespace="lab"}[1h])
```

## Step 4: Your own alert

**File:** `monitoring/prometheus/alerts.yaml`

```yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: frontend
  namespace: monitoring
  labels:
    release: mon
spec:
  groups:
    - name: frontend
      rules:
        - alert: FrontendDown
          expr: kube_deployment_status_replicas_available{namespace="lab",deployment="frontend"} < 1
          for: 1m
          labels:
            severity: critical
          annotations:
            summary: No frontend pods are available
        - alert: FrontendRestarting
          expr: increase(kube_pod_container_status_restarts_total{namespace="lab"}[10m]) > 3
          labels:
            severity: warning
          annotations:
            summary: Frontend container keeps restarting
```

```bash
kubectl apply -f monitoring/prometheus/alerts.yaml
```

Change `lab` and `frontend` if Helm gave your deployment another name.

Test: pause Argo CD auto-sync, scale to 0, wait, see the alert fire in Alertmanager, then restore. Optional: connect Alertmanager to email or Slack.

## Step 5: Logs with Loki + Alloy

1. Install **Loki** in single-binary mode with filesystem storage (small learning setup).
2. Install **Alloy** as a DaemonSet that reads pod logs and sends them to Loki.
3. Add Loki as a data source in Grafana.

Save your values in `monitoring/loki/` and any Alertmanager settings in `monitoring/alertmanager/` (no passwords or webhook URLs in Git).

Follow the current official pages, because chart locations and values change often:

- [Install Loki with Helm](https://grafana.com/docs/loki/latest/setup/install/helm/)
- [Alloy on Kubernetes](https://grafana.com/docs/alloy/latest/set-up/install/kubernetes/)

Query:

```logql
{namespace="lab"}
{namespace="lab"} |= "404"
```

## Step 6: Build one dashboard

Five panels only: available pods, CPU, memory, restarts, recent error logs. Export the JSON to `monitoring/grafana/dashboard.json`.

## Step 7: CloudWatch (during any AWS session)

Look at EC2 CPU metrics. Create one alarm (10 are free). Delete it afterwards.

## Four signals to remember

**Latency** (how slow), **traffic** (how many), **errors** (how many fail), **saturation** (how full).

## Break it

Cause each one and find it **using Grafana only**: wrong image tag, memory limit of 4Mi, probe failure, 0 replicas.

## Done when

- [ ] Dashboard shows your app
- [ ] An alert fired and resolved
- [ ] You can search logs in Grafana

Next: [Phases 15–16](15-16-advanced.md)
