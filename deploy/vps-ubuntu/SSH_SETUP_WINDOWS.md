# SSH Setup for Windows - Manual Method

Since `ssh-copy-id` is not available on Windows, follow these steps to manually add your SSH key to the VPS.

## Step 1: Get Your Public Key

Your public key has been displayed. It starts with `ssh-rsa` and ends with your email.

## Step 2: Connect to VPS with Password

```powershell
ssh user@72.61.229.21
# Enter your password when prompted
```

## Step 3: On the VPS, Create SSH Directory

Once connected to the VPS, run:

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
```

## Step 4: Add Your Public Key

On the VPS, run:

```bash
nano ~/.ssh/authorized_keys
```

Then:
1. Paste your entire public key (the one starting with `ssh-rsa`)
2. Press `Ctrl+X` to exit
3. Press `Y` to save
4. Press `Enter` to confirm

## Step 5: Set Proper Permissions

```bash
chmod 600 ~/.ssh/authorized_keys
```

## Step 6: Test Passwordless SSH

Exit the VPS:
```bash
exit
```

Then from your Windows machine, test the connection:
```powershell
ssh user@72.61.229.21
```

You should now connect without entering a password!

## Alternative: One-Line Method

If you prefer, you can do this in one command from your Windows PowerShell:

```powershell
$pubKey = Get-Content "$env:USERPROFILE\.ssh\id_rsa.pub"
ssh user@72.61.229.21 "mkdir -p ~/.ssh && chmod 700 ~/.ssh && echo '$pubKey' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
```

You'll need to enter your password once, and then it will set everything up automatically.

