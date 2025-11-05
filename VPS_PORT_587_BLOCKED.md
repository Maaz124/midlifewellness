# Port 587 is Blocked - Solutions

## Problem
Your VPS cannot connect to `smtp.gmail.com:587` - the connection times out. This means your VPS provider is blocking port 587.

## Solution 1: Contact VPS Provider (Recommended)

Your provider (appears to be DigitalOcean based on the hostname) likely blocks SMTP ports by default to prevent spam.

**Contact DigitalOcean Support:**
1. Go to DigitalOcean support
2. Request to unblock port 587 for outbound SMTP
3. They usually approve it within 24 hours

## Solution 2: Use Port 465 (SSL) Instead

Port 465 might not be blocked. Let's try it:

```bash
# Test port 465
telnet smtp.gmail.com 465

# If that works, update the code to use port 465
```

## Solution 3: Check Current Firewall Rules

Check if your local firewall is blocking it:

```bash
# Check UFW status
sudo ufw status verbose

# Check iptables
sudo iptables -L -n -v | grep 587

# Check if port 587 is explicitly blocked
sudo iptables -L OUTPUT -n -v
```

## Solution 4: Use Alternative Email Service

If ports are blocked, use a third-party service:
- **SendGrid** (free tier: 100 emails/day)
- **Mailgun** (free tier: 5,000 emails/month)
- **AWS SES** (very cheap)
- **Resend** (modern, developer-friendly)

## Quick Test Commands

```bash
# Test port 587
timeout 5 telnet smtp.gmail.com 587

# Test port 465
timeout 5 telnet smtp.gmail.com 465

# Test port 25 (usually blocked)
timeout 5 telnet smtp.gmail.com 25

# Test DNS resolution
nslookup smtp.gmail.com

# Test general connectivity
ping -c 3 smtp.gmail.com
```

## Immediate Workaround

While waiting for port 587 to be unblocked, you can:

1. **Use a different email service** (SendGrid, Mailgun, etc.)
2. **Use port 465** if it's not blocked
3. **Use a local mail relay** (complex setup)

Let me know which solution you'd like to pursue!

