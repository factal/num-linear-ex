let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}


let cachedFloat64Memory0 = null;

function getFloat64Memory0() {
    if (cachedFloat64Memory0 === null || cachedFloat64Memory0.byteLength === 0) {
        cachedFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64Memory0;
}

let WASM_VECTOR_LEN = 0;

function passArrayF64ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 8, 8) >>> 0;
    getFloat64Memory0().set(arg, ptr / 8);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
* @param {number} size
* @param {Float64Array} a
* @returns {boolean}
*/
export function is_invertible(size, a) {
    const ptr0 = passArrayF64ToWasm0(a, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.is_invertible(size, ptr0, len0);
    return ret !== 0;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

function getArrayF64FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat64Memory0().subarray(ptr / 8, ptr / 8 + len);
}
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
export function solve_8_1(size, a, b, init, max_iter) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArrayF64ToWasm0(a, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(b, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArrayF64ToWasm0(init, wasm.__wbindgen_malloc);
        const len2 = WASM_VECTOR_LEN;
        wasm.solve_8_1(retptr, size, ptr0, len0, ptr1, len1, ptr2, len2, max_iter);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v4 = getArrayF64FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 8);
        return v4;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {number} size
* @param {Float64Array} a
* @param {Float64Array} b
* @param {Float64Array} init
* @param {number} max_iter
* @returns {Float64Array}
*/
export function solve_by_gauss_seidel(size, a, b, init, max_iter) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArrayF64ToWasm0(a, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(b, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArrayF64ToWasm0(init, wasm.__wbindgen_malloc);
        const len2 = WASM_VECTOR_LEN;
        wasm.solve_by_gauss_seidel(retptr, size, ptr0, len0, ptr1, len1, ptr2, len2, max_iter);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v4 = getArrayF64FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 8);
        return v4;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {number} size
* @param {Float64Array} a
* @param {Float64Array} b
* @returns {Float64Array}
*/
export function solve_linear(size, a, b) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArrayF64ToWasm0(a, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(b, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        wasm.solve_linear(retptr, size, ptr0, len0, ptr1, len1);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v3 = getArrayF64FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 8);
        return v3;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

