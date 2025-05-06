/**
 * Safely evaluates a mathematical expression string.
 * 
 * This function uses Function to evaluate the expression instead of eval(),
 * which is slightly safer, but still requires validation.
 * 
 * @param expression - The mathematical expression to evaluate
 * @returns The result of the evaluation
 */
export function evaluateMathExpression(expression: string): number {
  // Sanitize the expression first
  const sanitizedExpression = sanitizeExpression(expression);
  
  // Validate that the expression only contains allowed characters
  if (!isValidExpression(sanitizedExpression)) {
    throw new Error('Invalid mathematical expression');
  }
  
  try {
    // Use Function instead of eval, which is slightly better
    // Create a function that returns the evaluated expression
    const evalFunction = new Function(`return ${sanitizedExpression}`);
    const result = evalFunction();
    
    // Check if the result is a valid number
    if (typeof result !== 'number' || !isFinite(result)) {
      throw new Error('Invalid result');
    }
    
    return result;
  } catch (error) {
    console.error('Error evaluating expression:', error);
    throw new Error('Failed to evaluate expression');
  }
}

/**
 * Sanitizes a mathematical expression by removing unwanted characters.
 * 
 * @param expression - The expression to sanitize
 * @returns Sanitized expression
 */
function sanitizeExpression(expression: string): string {
  // Convert words to operators and mathematical functions
  let sanitized = expression
    .toLowerCase()
    .replace(/mais/g, '+')
    .replace(/menos/g, '-')
    .replace(/vezes/g, '*')
    .replace(/dividido por/g, '/')
    .replace(/dividido/g, '/')
    .replace(/dividir/g, '/')
    .replace(/multiplica(r|do) por/g, '*')
    .replace(/multiplicar/g, '*')
    .replace(/raiz quadrada de/g, 'Math.sqrt(')
    .replace(/raiz de/g, 'Math.sqrt(')
    .replace(/seno de/g, 'Math.sin(')
    .replace(/cosseno de/g, 'Math.cos(')
    .replace(/tangente de/g, 'Math.tan(')
    .replace(/log de/g, 'Math.log(')
    .replace(/potência de/g, 'Math.pow(')
    .replace(/absoluto de/g, 'Math.abs(')
    .replace(/pi/g, 'Math.PI')
    .replace(/sen\(/g, 'Math.sin(')
    .replace(/cos\(/g, 'Math.cos(')
    .replace(/tan\(/g, 'Math.tan(')
    .replace(/sqrt\(/g, 'Math.sqrt(')
    .replace(/abs\(/g, 'Math.abs(')
    .replace(/pow\(/g, 'Math.pow(')
    .replace(/log\(/g, 'Math.log(')
    .replace(/\^/g, '**'); // Replace caret with JavaScript's exponentiation operator
  
  // Remove all characters except allowed ones
  sanitized = sanitized.replace(/[^\d+\-*/().^eE, ]|Math\.\w+/g, '');
  
  return sanitized;
}

/**
 * Validates if the expression contains only allowed characters and patterns.
 * 
 * @param expression - The expression to validate
 * @returns Whether the expression is valid
 */
function isValidExpression(expression: string): boolean {
  // Check for valid mathematical expression
  // Allow digits, operators, parentheses, decimal points, e for scientific notation,
  // and specific Math functions
  const validPattern = /^[\d+\-*/().^eE, ]*$|^(Math\.\w+\([\d+\-*/().^eE, ]*\))*$/;
  return validPattern.test(expression) && !containsCodeInjection(expression);
}

/**
 * Checks if the expression might contain code injection attempts.
 * 
 * @param expression - The expression to check
 * @returns Whether the expression contains potential code injection
 */
function containsCodeInjection(expression: string): boolean {
  // Check for suspicious patterns that could indicate code injection
  const suspiciousPatterns = [
    /function/i,
    /eval/i,
    /setTimeout/i,
    /setInterval/i,
    /Function/i,
    /\${/,
    /import/i,
    /require/i,
    /process/i,
    /document/i,
    /window/i,
    /console/i,
    /\blocalStorage\b/i,
    /\bsessionStorage\b/i,
    /\bcookies\b/i,
    /alert/i,
    /fetch/i,
    /XMLHttpRequest/i
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(expression));
}