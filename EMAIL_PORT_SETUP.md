# Email Port Configuration for VPS

## Quick Answer: **No Inbound Ports Needed!**

Your VPS makes **outbound connections** to Gmail's SMTP servers. You don't need to open any inbound ports.

## Port Configuration

The code is configured to use:
- **Port 587** (STARTTLS) - This is the recommended port for Gmail SMTP
- **Host**: smtp.gmail.com

## Why This Works

1. **Outbound Connections**: Your server connects TO Gmail (not the other way around)
2. **Port 587**: Most VPS providers allow outbound connections on port 587
3. **No Inbound Required**: Gmail doesn't need to connect back to your server

## If Emails Still Don't Work

### Check 1: Firewall Rules (Most VPS providers allow outbound by default)

If you're using `ufw` (Ubuntu Firewall):
```bash
# Check if outbound is allowed (should be default)
sudo ufw status verbose

# If needed, explicitly allow outbound SMTP
sudo ufw allow out 587/tcp
```

If using `iptables`:
```bash
# Check current rules
sudo iptables -L -n

# Allow outbound on port 587 (usually already allowed)
sudo iptables -A OUTPUT -p tcp --dport 587 -j ACCEPT
```

### Check 2: VPS Provider Restrictions

Some VPS providers block port 25 by default. Since we're using port 587, this shouldn't be an issue, but check your provider's documentation.

**Common providers:**
- **DigitalOcean**: Port 587 is allowed by default
- **AWS EC2**: Port 587 is allowed by default
- **Linode**: Port 587 is allowed by default
- **Vultr**: Port 587 is allowed by default

### Check 3: Test Connection

Test if your VPS can reach Gmail's SMTP server:

```bash
# Test connection to Gmail SMTP
telnet smtp.gmail.com 587

# Or using nc (netcat)
nc -zv smtp.gmail.com 587
```

If you see "Connected" or "succeeded", the port is accessible.

### Check 4: Alternative Port (if 587 is blocked)

If port 587 is blocked, you can try port 465 (SSL):

Update the code to use port 465:
```javascript
port: 465,
secure: true, // SSL instead of STARTTLS
```

## Troubleshooting

1. **Check server logs** for connection errors:
   ```bash
   # Look for SMTP connection errors
   tail -f /path/to/your/app/logs
   ```

2. **Test email sending** with a simple script:
   ```javascript
   const nodemailer = require('nodemailer');
   const transporter = nodemailer.createTransport({
     service: 'gmail',
     host: 'smtp.gmail.com',
     port: 587,
     secure: false,
     auth: {
       user: 'your-email@gmail.com',
       pass: 'your-app-password'
     }
   });
   
   transporter.verify((error, success) => {
     if (error) {
       console.log('Error:', error);
     } else {
       console.log('Server is ready to send emails');
     }
   });
   ```

## Summary

✅ **No action needed** in most cases - outbound port 587 is usually allowed by default

✅ If emails fail, check:
   1. Firewall allows outbound on port 587
   2. VPS provider doesn't block port 587
   3. Gmail App Password is correct
   4. Network connectivity to smtp.gmail.com

