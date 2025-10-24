# i18n Language Persistence - Test Scenarios

## Manual Testing Guide

This document provides step-by-step instructions to test the i18n language persistence solution.

## Prerequisites

- Application running locally (`npm start`)
- Browser developer tools access
- Multiple browser language settings (optional)

## Test Scenarios

### Test 1: Browser Language Detection

**Objective**: Verify that the system automatically detects browser language

**Steps**:
1. Open browser developer tools (F12)
2. Go to Application tab → Local Storage
3. Clear all localStorage entries
4. Refresh the page (F5)
5. Check console logs for language detection messages
6. Verify the site loads in the detected language

**Expected Result**: 
- Site loads in browser's primary language (if supported)
- Falls back to pt-BR if browser language not supported
- Language preference is saved to localStorage

**Console Output Example**:
```
TranslationService: Detected browser language: en-US
TranslationService: Mapped to supported language: en
TranslationService: Loading translations for: en
```

### Test 2: Language Persistence Across Reloads

**Objective**: Verify that language preference persists across page reloads

**Steps**:
1. Navigate to Settings page
2. Change language to Spanish (Español)
3. Verify site language changes immediately
4. Refresh the page (F5)
5. Verify site remains in Spanish
6. Check localStorage for `user_language` key

**Expected Result**:
- Language changes immediately when selected
- Language persists after page refresh
- localStorage contains `"user_language": "es"`

### Test 3: Multiple Language Switching

**Objective**: Test switching between all supported languages

**Steps**:
1. Start with default language (pt-BR)
2. Switch to English
3. Switch to Spanish
4. Switch back to Portuguese
5. Refresh page after each change
6. Verify each language persists correctly

**Expected Result**:
- All language switches work immediately
- Each language persists after refresh
- No console errors during switching

### Test 4: Logout Language Reset

**Objective**: Verify that language preference is cleared on logout

**Steps**:
1. Login to the application
2. Change language to English
3. Verify language is saved in localStorage
4. Logout from the application
5. Check localStorage after logout
6. Refresh page and verify language detection

**Expected Result**:
- `user_language` is removed from localStorage on logout
- Next page load detects browser language again
- Fresh language detection for new session

### Test 5: Error Handling

**Objective**: Test fallback behavior when translation files fail

**Steps**:
1. Open browser developer tools
2. Go to Network tab
3. Block requests to `/i18n/en.json`
4. Try to switch to English
5. Check console for error messages
6. Verify fallback to default language

**Expected Result**:
- Error logged in console
- Automatic fallback to pt-BR
- Site remains functional

### Test 6: Unsupported Language Handling

**Objective**: Test behavior with unsupported browser languages

**Steps**:
1. Change browser language to French (fr-FR)
2. Clear localStorage
3. Refresh the page
4. Verify fallback to default language
5. Check console for detection messages

**Expected Result**:
- Browser language detected but not supported
- Falls back to pt-BR (default)
- Console shows mapping attempt

## Browser Language Testing

### Chrome/Edge
1. Go to Settings → Languages
2. Add desired language
3. Move to top of list
4. Restart browser

### Firefox
1. Go to Settings → General → Language
2. Choose desired language
3. Restart browser

### Safari
1. Go to System Preferences → Language & Region
2. Add desired language
3. Restart browser

## Console Commands for Testing

### Check Current Language
```javascript
// In browser console
localStorage.getItem('user_language')
```

### Check Supported Languages
```javascript
// In browser console (if TranslationService is accessible)
angular.getComponent(document.body).translationService.getSupportedLanguages()
```

### Simulate Language Change
```javascript
// In browser console
localStorage.setItem('user_language', 'es')
location.reload()
```

### Clear Language Preference
```javascript
// In browser console
localStorage.removeItem('user_language')
location.reload()
```

## Expected localStorage Structure

### After Language Selection
```json
{
  "user_language": "en",
  "auth_token": "...",
  "user_profile": "..."
}
```

### After Logout
```json
{
  "auth_token": null,
  "user_profile": null
  // user_language should be removed
}
```

## Troubleshooting

### Common Issues

**Issue**: Language not persisting after refresh
**Solution**: Check localStorage for `user_language` key

**Issue**: Site always loads in pt-BR
**Solution**: Check browser language settings and console logs

**Issue**: Language switching not working
**Solution**: Check for JavaScript errors in console

**Issue**: Translation files not loading
**Solution**: Check Network tab for failed requests to `/i18n/`

### Debug Information

Enable detailed logging by adding this to browser console:
```javascript
// Monitor localStorage changes
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
  console.log(`localStorage.setItem: ${key} = ${value}`);
  originalSetItem.apply(this, arguments);
};

const originalRemoveItem = localStorage.removeItem;
localStorage.removeItem = function(key) {
  console.log(`localStorage.removeItem: ${key}`);
  originalRemoveItem.apply(this, arguments);
};
```

## Performance Testing

### Load Time Impact
- Measure initial page load time
- Compare with and without language detection
- Verify no significant performance impact

### Memory Usage
- Monitor memory usage during language switching
- Check for memory leaks in translation loading
- Verify proper cleanup of old translations

## Cross-Browser Testing

Test the solution in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Verify consistent behavior across all browsers.

## Conclusion

This testing guide ensures the i18n language persistence solution works correctly across all scenarios and browsers. The solution provides a robust, user-friendly internationalization system that enhances the user experience for global users.
