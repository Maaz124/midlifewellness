# VPS Firewall Setup for Email (Gmail SMTP)

## Ports to Open

**Outbound Port 587** (TCP) - This is the port Gmail SMTP uses with STARTTLS

## Quick Fix Commands

### For Ubuntu/Debian (UFW Firewall)

```bash
# Allow outbound SMTP on port 587
sudo ufw allow out 587/tcp

# Verify the rule was added
sudo ufw status verbose

# If you need to reload firewall
sudo ufw reload
```

### For CentOS/RHEL (firewalld)

```bash
# Allow outbound SMTP
sudo firewall-cmd --add-port=587/tcp --permanent
sudo firewall-cmd --reload

# Verify
sudo firewall-cmd --list-ports
```

### For iptables (Direct)

```bash
# Allow outbound on port 587
sudo iptables -A OUTPUT -p tcp --dport 587 -j ACCEPT

# Save rules (Ubuntu/Debian)
sudo iptables-save | sudo tee /etc/iptables/rules.v4

# Or for CentOS/RHEL
sudo service iptables save
```

### Alternative: Use Port 465 (SSL)

If port 587 is blocked by your VPS provider, you can try port 465:

```bash
# Allow port 465
sudo ufw allow out 465/tcp

# Or with iptables
sudo iptables -A OUTPUT -p tcp --dport 465 -j ACCEPT
```

## Test Connectivity

Before opening ports, test if the connection works:

```bash
# Test connection to Gmail SMTP
telnet smtp.gmail.com 587

# Or using nc (netcat)
nc -zv smtp.gmail.com 587

# Or using curl
curl -v telnet://smtp.gmail.com:587
```

If you see "Connected" or "succeeded", the port is accessible. If you see "Connection refused" or timeout, the port is blocked.

## Check Current Firewall Status

```bash
# UFW
sudo ufw status verbose

# iptables
sudo iptables -L -n -v | grep 587

# Check if port 587 is blocked
sudo netstat -tuln | grep 587
```

## Common VPS Provider Issues

Some VPS providers block SMTP ports by default. Check your provider's documentation:

- **DigitalOcean**: Usually allows port 587, but may require opening a support ticket
- **AWS EC2**: May require security group rules
- **Linode**: Usually allows port 587
- **Vultr**: Usually allows port 587
- **Hetzner**: Usually allows port 587

## If Port 587 is Blocked by Provider

1. **Contact your VPS provider** to unblock port 587
2. **Use port 465** (SSL) instead - update the code
3. **Use a third-party email service** like SendGrid, Mailgun, or AWS SES

## Verify It Works

After opening the port, test again:

```bash
# Test connection
telnet smtp.gmail.com 587

# You should see:
# Trying 173.194.76.108...
# Connected to smtp.gmail.com.
# Escape character is '^]'.
# 220 smtp.gmail.com ESMTP ...
```

