# Rollback Plan

If issues occur with RainbowKit migration:

## Option 1: Git Rollback
```bash
git reset --hard <commit-before-migration>
git push --force
```

## Option 2: Partial Rollback
Keep the new provider but revert specific files:
```bash
git revert <problematic-commit>
```

## Known Issues & Solutions

### Issue: Wallet not connecting
- Check WalletConnect project ID
- Verify chain configuration
- Clear browser cache

### Issue: Types not recognized
- Run TypeScript check
- Update imports
- Restart IDE

