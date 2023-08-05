---
title: "Setup Swarm"
sidebar_label: "Swarm Mode"
sidebar_position: 4
pagination_next: stack/traefik/traefik
tags:
  - docker swarm
---

For truly highly-available services with Docker containers, we need an orchestration system. Docker Swarm is the simplest way to achieve redundancy, such that a single docker host could be turned off, and none of our services will be interrupted.

## Init Swarm

Now, to launch a swarm. Pick a target node, and run

```bash
sudo docker swarm init --advertise-addr <MANAGER-IP>
```

You will see output like this

```bash
[root@node-01 ~]# sudo docker swarm init --advertise-addr 192.168.0.21
Swarm initialized: current node (b54vls3wf8xzbhwz79nlkivt8) is now a manager.

To add a worker to this swarm, run the following command:

    docker swarm join \
    --token SWMTKN-1-2orjbzjzjvm1bbo736xxmxzwaf4rffxwi0tu3zonjlsek4mja0-bsud7xnvhv4cicwi7l6c9s6l0 \
    192.168.0.21:2377

To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.

[root@node-01 ~]#
```

To confirm that you have a node swarm, run

```bash
sudo docker node ls
```
```bash
[root@node-01 ~]# sudo docker node ls
ID                           HOSTNAME                STATUS  AVAILABILITY  MANAGER STATUS
b54vls3wf8xzbhwz79nlkivt8 *  nd1.domain.com          Ready     Active         Leader
[root@node-01 ~]#
```

Note that when you run docker swarm init above, the CLI output gives youe a command to run to join further nodes to my swarm. This command would join the nodes as workers (as opposed to managers). Workers can easily be promoted to managers (and demoted again), but since we know that we want our other two nodes to be managers too, it's simpler just to add them to the swarm as managers immediately.

On the first swarm node, generate the necessary token to join another manager by running

```bash
sudo docker swarm join-token manager
```

```bash
[root@node-01 ~]# sudo docker swarm join-token manager
To add a manager to this swarm, run the following command:

    docker swarm join \
    --token SWMTKN-1-2orjbzjzjvm1bbo736xxmxzwaf4rffxwi0tu3zopal4xk4mja0-cfm24bq2zvfkcwujwlp5zqxta \
    192.168.0.21:2377

[root@node-01 ~]#
```

Run the command provided on your other nodes to join them to the swarm as managers. After addition of a node, the output of docker node ls (on either host) should reflect all the nodes:

```bash
[root@node-02]# sudo docker node ls
ID                           HOSTNAME                STATUS  AVAILABILITY  MANAGER STATUS
b54vls3wf8xzbhwz79nlkivt8 *  nd1.domain.com           Ready   Active        Leader
xmw49jt5a1j87a6ihul76gbgy    nd2.domain.com           Ready   Active        Reachable
[root@node-02]#
```

### Recommendation 

The next step after setup swarm is deploy Traefik.