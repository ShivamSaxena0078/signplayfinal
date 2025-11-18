#!/usr/bin/env python3
"""
Security check script to verify no secrets are being committed
Run this before git commit to ensure safety
"""

import os
import re
import sys

def check_for_secrets():
    """Check for common secret patterns in staged files"""
    
    print("🔍 Checking for secrets in staged files...")
    print("=" * 50)
    
    # Get list of staged files
    staged_files = os.popen('git diff --cached --name-only').read().strip().split('\n')
    
    if not staged_files or staged_files == ['']:
        print("⚠️  No files staged for commit")
        return True
    
    # Patterns to look for
    secret_patterns = [
        (r'mongodb\+srv://[^:]+:[^@]+@', 'MongoDB connection string'),
        (r'JWT_SECRET\s*=\s*["\']?[^"\'\s]+', 'JWT Secret'),
        (r'password\s*[=:]\s*["\']?[^"\'\s]+', 'Password'),
        (r'api[_-]?key\s*[=:]\s*["\']?[^"\'\s]+', 'API Key'),
        (r'secret[_-]?key\s*[=:]\s*["\']?[^"\'\s]+', 'Secret Key'),
        (r'access[_-]?token\s*[=:]\s*["\']?[^"\'\s]+', 'Access Token'),
    ]
    
    # Files that should never be committed
    forbidden_files = [
        '.env',
        'server/.env',
        'ml_service/.env',
        '.env.local',
        '.env.development.local',
        '.env.production.local',
    ]
    
    issues_found = False
    
    # Check for forbidden files
    print("\n📋 Checking for forbidden files...")
    for file in staged_files:
        if file in forbidden_files or file.endswith('.env'):
            print(f"❌ FORBIDDEN FILE: {file}")
            issues_found = True
    
    if not issues_found:
        print("✅ No forbidden files found")
    
    # Check file contents for secrets
    print("\n🔎 Scanning file contents for secrets...")
    for file in staged_files:
        if not os.path.exists(file):
            continue
            
        # Skip binary files and large files
        if file.endswith(('.png', '.jpg', '.jpeg', '.gif', '.ico', '.pdf')):
            continue
            
        try:
            with open(file, 'r', encoding='utf-8') as f:
                content = f.read()
                
            for pattern, secret_type in secret_patterns:
                matches = re.finditer(pattern, content, re.IGNORECASE)
                for match in matches:
                    print(f"❌ POTENTIAL SECRET in {file}:")
                    print(f"   Type: {secret_type}")
                    print(f"   Line: {match.group()[:50]}...")
                    issues_found = True
                    
        except Exception as e:
            print(f"⚠️  Could not read {file}: {e}")
    
    print("\n" + "=" * 50)
    
    if issues_found:
        print("❌ SECURITY ISSUES FOUND!")
        print("⚠️  DO NOT COMMIT until issues are resolved!")
        print("\nTo fix:")
        print("1. Remove sensitive files: git reset HEAD <file>")
        print("2. Add files to .gitignore")
        print("3. Remove secrets from code")
        return False
    else:
        print("✅ No secrets detected in staged files")
        print("✅ Safe to commit!")
        return True

def check_gitignore():
    """Verify .gitignore has essential entries"""
    print("\n🛡️  Checking .gitignore...")
    
    required_entries = [
        '.env',
        'server/.env',
        'node_modules/',
        '__pycache__/',
    ]
    
    if not os.path.exists('.gitignore'):
        print("❌ .gitignore file not found!")
        return False
    
    with open('.gitignore', 'r') as f:
        gitignore_content = f.read()
    
    missing = []
    for entry in required_entries:
        if entry not in gitignore_content:
            missing.append(entry)
    
    if missing:
        print("❌ Missing entries in .gitignore:")
        for entry in missing:
            print(f"   - {entry}")
        return False
    else:
        print("✅ .gitignore has essential entries")
        return True

def main():
    print("🔒 SignPlay Security Check")
    print("=" * 50)
    
    gitignore_ok = check_gitignore()
    secrets_ok = check_for_secrets()
    
    print("\n" + "=" * 50)
    print("📊 FINAL RESULT:")
    print("=" * 50)
    
    if gitignore_ok and secrets_ok:
        print("✅ ALL CHECKS PASSED")
        print("✅ Safe to proceed with commit")
        sys.exit(0)
    else:
        print("❌ CHECKS FAILED")
        print("⚠️  Fix issues before committing!")
        sys.exit(1)

if __name__ == "__main__":
    main()
