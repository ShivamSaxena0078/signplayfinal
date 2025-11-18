# 🚀 Git Commit Guide for SignPlay

## ⚠️ IMPORTANT: Security Checklist

Before committing, ensure these files are **NOT** included:
- ❌ `.env` (root directory)
- ❌ `server/.env`
- ❌ `ml_service/.env`
- ❌ Any files containing passwords, API keys, or secrets
- ❌ `node_modules/` directories
- ❌ `.next/` build directory

## ✅ Step-by-Step Git Commands

### 1. Initialize Git (if not already done)
```bash
git init
```

### 2. Add Remote Repository
```bash
git remote add origin https://github.com/ShivamSaxena0078/signplay-final.git
```

### 3. Check Current Status
```bash
git status
```

**Verify that .env files are NOT listed!**

### 4. Add All Files (except those in .gitignore)
```bash
git add .
```

### 5. Verify What Will Be Committed
```bash
git status
```

**Double-check that no .env files appear in the list!**

### 6. Commit Your Changes
```bash
git commit -m "Initial commit: Complete SignPlay application with AI gesture recognition"
```

### 7. Push to GitHub
```bash
git push -u origin main
```

If the branch is named 'master' instead of 'main':
```bash
git push -u origin master
```

## 🔍 Verify No Secrets Are Committed

### Check what files are staged:
```bash
git diff --cached --name-only
```

### Search for potential secrets:
```bash
git diff --cached | grep -i "password\|secret\|api_key\|mongodb"
```

If you see any secrets, **DO NOT COMMIT!**

## 🛡️ If You Accidentally Committed Secrets

### 1. Remove the file from Git (but keep it locally)
```bash
git rm --cached .env
git rm --cached server/.env
```

### 2. Commit the removal
```bash
git commit -m "Remove sensitive files"
```

### 3. Push the changes
```bash
git push origin main
```

### 4. Change all exposed secrets immediately!
- Generate new JWT_SECRET
- Rotate MongoDB password
- Update all API keys

## 📋 Recommended Commit Messages

### Initial Commit
```bash
git commit -m "Initial commit: Complete SignPlay application

- AI gesture recognition with MediaPipe + KNN
- Interactive game system with 10-question quiz
- Comprehensive dashboard with statistics
- Secure authentication with JWT
- MongoDB session-based data model
- Professional UI with Montserrat typography"
```

### Feature Commits
```bash
git commit -m "feat: Add gesture recognition system"
git commit -m "feat: Implement dashboard with charts"
git commit -m "fix: Resolve JWT authentication issues"
git commit -m "style: Update UI with Montserrat font"
git commit -m "docs: Add comprehensive README"
```

## 🔄 Updating Your Repository

### Pull latest changes
```bash
git pull origin main
```

### Add new changes
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

## 🌿 Working with Branches

### Create a new branch
```bash
git checkout -b feature/new-feature
```

### Switch branches
```bash
git checkout main
```

### Merge branch
```bash
git checkout main
git merge feature/new-feature
```

## 📝 .gitignore Verification

Your `.gitignore` file should include:
```
.env
.env.local
.env*.local
server/.env
ml_service/.env
node_modules/
.next/
__pycache__/
*.pyc
```

## ✅ Final Checklist Before Push

- [ ] Verified .env files are in .gitignore
- [ ] Checked `git status` - no sensitive files listed
- [ ] Reviewed `git diff --cached` - no secrets visible
- [ ] Tested application locally
- [ ] Updated README.md with accurate information
- [ ] All features working correctly
- [ ] No hardcoded passwords or API keys in code

## 🎯 Quick Commands Summary

```bash
# Check status
git status

# Add all files
git add .

# Commit
git commit -m "Your message"

# Push
git push origin main

# View commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

## 🆘 Need Help?

If you're unsure about anything:
1. Run `git status` to see what will be committed
2. Run `git diff --cached` to see the actual changes
3. Don't push if you see any secrets!
4. You can always undo with `git reset`

---

**Remember: Once pushed to GitHub, secrets are exposed forever in Git history!**
**Always double-check before pushing!**
