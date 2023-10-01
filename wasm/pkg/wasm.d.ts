/* tslint:disable */
/* eslint-disable */
/**
* @param {number} size
* @param {Float64Array} a
* @returns {boolean}
*/
export function is_invertible(size: number, a: Float64Array): boolean;
/**
* Solve Allaire G., Kaber S. M. - "Numerical linear algebra", Exercise 8.1
* 
* # Arguments
* 
* * `size` - Size of the matrix
* * `a` - Matrix A, stored in row-major order
* * `b` - Vector b
* * `init` - Initial guess
* * `max_iter` - Maximum number of iterations
* 
* # Returns
* 
* The solution of each iteration, stored in this way:
* 
* \[x_1^(1), y_1^(1), z_1^(1), x_2^(1), y_2^(1), z_2^(1), ..., x_maxiter^(3), y_maxiter^(3), z_maxiter^(3)\]
* @param {number} size
* @param {Float64Array} a
* @param {Float64Array} b
* @param {Float64Array} init
* @param {number} max_iter
* @returns {Float64Array}
*/
export function solve_8_1(size: number, a: Float64Array, b: Float64Array, init: Float64Array, max_iter: number): Float64Array;
/**
* @param {number} size
* @param {Float64Array} a
* @param {Float64Array} b
* @param {Float64Array} init
* @param {number} max_iter
* @returns {Float64Array}
*/
export function solve_by_gauss_seidel(size: number, a: Float64Array, b: Float64Array, init: Float64Array, max_iter: number): Float64Array;
/**
* Solve real linear system Ax = b
* 
* # Arguments
* 
* * `size` - Size of the matrix
* * `a` - Matrix A, stored in row-major order
* * `b` - Vector b
* 
* # Returns
* 
* The solution of Ax = b i.e. x = A^-1 * b
* @param {number} size
* @param {Float64Array} a
* @param {Float64Array} b
* @returns {Float64Array}
*/
export function solve_linear(size: number, a: Float64Array, b: Float64Array): Float64Array;
