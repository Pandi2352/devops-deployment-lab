# Phases 15–16: Advanced DevOps and Extra Tools

## Phase 15: Advanced (free on Kind)

| Method | How | Good | Bad |
|---|---|---|---|
| Rolling | Replace pods slowly | Simple, default | Two versions run together |
| Blue-green | Two full versions, switch traffic | Instant rollback | Double resources |
| Canary | Send 10% of traffic first | Safest | More complex |

### Exercise 1: Blue-green by hand

1. Create Deployments `frontend-blue` and `frontend-green` with label `color`.
2. Add `color: blue` to the Service selector.
3. Change it to `green`. Traffic switches at once. Change back = rollback.

### Exercise 2: Canary with Argo Rollouts

1. Install [Argo Rollouts](https://argo-rollouts.readthedocs.io/).
2. Change the Deployment into a `Rollout` with steps 20% → pause → 50% → pause → 100%.
3. Release a bad image and abort it.

### Exercise 3: Load test

```bash
docker run --rm -i --network host grafana/k6 run --vus 20 --duration 60s - <<'EOF'
import http from 'k6/http';
import { check } from 'k6';
export default function () {
  const res = http.get('http://localhost:8080/');
  check(res, { 'is 200': (r) => r.status === 200 });
}
EOF
```

Run only against your own app. If `--network host` cannot reach it, use `http://host.docker.internal:8080/` without that flag. Watch HPA and Grafana during the test.

### Exercise 4: High availability

- 3 replicas with `topologySpreadConstraints` so pods run on different nodes.
- A `PodDisruptionBudget` with `minAvailable: 2`.
- Drain a node during a load test. Users should see no errors.

### Exercise 5: Disaster recovery

1. Delete the whole Kind cluster.
2. Rebuild it: Kind + Traefik + Argo CD + Application.
3. Measure the time. That is your **RTO** (time to recover). **RPO** is how much data you can lose; here it is zero because everything is in Git.
4. Put your exact commands in `docs/RUNBOOK.md`.

### Exercise 6: Cost review

Write what the full AWS setup costs per month, and 3 ways to reduce it.

## Phase 16: Extra tools

Do **not** try to master all of these. Try the first two, then choose by job descriptions you see.

| Order | Tool | Small exercise | Cost |
|---|---|---|---|
| 1 | Ansible | In `ansible/`: an inventory, a playbook, and a `docker` role that installs Docker + Nginx (phase 6, steps 4–6) | Free |
| 2 | Jenkins | Run in Docker; copy your CI steps to a Jenkinsfile | Free |
| 3 | Nginx | Add rate limiting and gzip | Free |
| 4 | Vault | Run dev mode, store and read one secret | Free |
| 5 | Lambda | One hello function with a function URL; delete after | Free allowance |
| 6 | SQS + SNS | Send one message to a queue and one email; delete after | Free allowance |
| 7 | GitLab CI | Copy the CI steps to `.gitlab-ci.yml` | Free tier |
| 8 | Nexus | Run locally as a Docker registry (needs much memory) | Free edition |

## Done when

- [ ] Exercises 1–5 done
- [ ] Cluster rebuilt from Git using your runbook
- [ ] Two extra tools tried

Next: [Phases 17–18](17-18-final-project.md)
