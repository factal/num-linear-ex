mod utils;

use std::iter::FromIterator;

use wasm_bindgen::prelude::*;
// use ndarray::prelude::*;
// use ndarray_linalg::*;
use rulinalg::{matrix::*, vector::Vector};
use nalgebra::{DMatrix, DVector, ComplexField};
use rand::{self, Rng};

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;


#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    // The `console.log` is quite polymorphic, so we can bind it with multiple
    // signatures. Note that we need to use `js_name` to ensure we always call
    // `log` in JS.
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u32(a: u32);

    // Multiple arguments too!
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_many(a: &str, b: &str);
}

#[wasm_bindgen]
pub fn is_invertible(size: usize, a: Vec<f64>) -> bool {
    let a = Matrix::new(size, size, a);
    log(&a.to_string());
    a.inverse().is_ok()
}

fn nalgebra_test(size: usize) {
    let mat = nalgebra::DMatrix::from_iterator(size, size, (0..size * size).map(|x| x as f64));
    let vec = nalgebra::DVector::from_iterator(size, (0..size).map(|x| x as f64));
}

/// Solve Allaire G., Kaber S. M. - "Numerical linear algebra", Exercise 8.1
/// 
/// # Arguments
/// 
/// * `size` - Size of the matrix
/// * `a` - Matrix A, stored in row-major order
/// * `b` - Vector b
/// * `init` - Initial guess
/// * `max_iter` - Maximum number of iterations
/// 
/// # Returns
/// 
/// The solution of each iteration, stored in this way:
/// 
/// \[x_1^(1), y_1^(1), z_1^(1), x_2^(1), y_2^(1), z_2^(1), ..., x_maxiter^(3), y_maxiter^(3), z_maxiter^(3)\]
#[wasm_bindgen]
pub fn solve_8_1(size: usize, a: Vec<f64>, b: Vec<f64>, init: Vec<f64>, max_iter: usize) -> Vec<f64> {
    let a = Matrix::new(size, size, a);
    let b = Vector::new(b);
    let init = Vector::new(init);

    let m_1 = Matrix::from_diag(&a.diag().cloned().collect::<Vec<_>>());
    let m_1_inv = m_1.clone().inverse().unwrap();
    let n_1 = &m_1 - &a;

    // Extract the lower triangular component of A
    let m_2 = Matrix::new(size, size, a.iter().enumerate().map(|(i, x)| if i % size <= i / size { *x } else { 0. }).collect::<Vec<_>>());
    let m_2_inv = m_2.clone().inverse().unwrap();
    let n_2 = &m_2 - &a;

    let m_3 = m_2 * 2.;
    let m_3_inv = m_3.clone().inverse().unwrap();
    let n_3 = &m_3 - &a;

    let mut x_1 = Vector::from_iter(init.clone());
    let mut x_2 = Vector::from_iter(init.clone());
    let mut x_3 = Vector::from_iter(init.clone());

    let mut ans_1 = vec![];
    let mut ans_2 = vec![];
    let mut ans_3 = vec![];

    let mut i = 0;
    while i < max_iter {
        x_1 = &m_1_inv * (&n_1 * &x_1 + &b);
        x_2 = &m_2_inv * (&n_2 * &x_2 + &b);
        x_3 = &m_3_inv * (&n_3 * &x_3 + &b);

        ans_1.push(x_1.clone().into_vec());
        ans_2.push(x_2.clone().into_vec());
        ans_3.push(x_3.clone().into_vec());

        i += 1;
    }

    [ans_1, ans_2, ans_3].concat().concat()
}

#[wasm_bindgen]
pub fn solve_by_gauss_seidel(size: usize, a: Vec<f64>, b: Vec<f64>, init: Vec<f64>, max_iter: usize) -> Vec<f64> {
    let a = Matrix::new(size, size, a);
    let b = Vector::new(b);
    let init = Vector::new(init);

    let d = Matrix::from_diag(&a.diag().cloned().collect::<Vec<_>>());
    let e = Matrix::new(size, size, a.iter().enumerate().map(|(i, x)| if i % size < i / size { -*x } else { 0. }).collect::<Vec<_>>());
    let f = Matrix::new(size, size, a.iter().enumerate().map(|(i, x)| if i % size > i / size { -*x } else { 0. }).collect::<Vec<_>>());
    let m = &d - &e;
    let m_inv = m.clone().inverse().unwrap();

    let mut x = Vector::from_iter(init.clone());

    let mut ans = vec![];

    let mut i = 0;
    while i < max_iter {
        x = &m_inv * (&f * &x + &b);

        ans.push(x.clone().into_vec());

        i += 1;
    }

    ans.concat()
}

fn solve_by_iterative(m_inv: DMatrix<f64>, n: DMatrix<f64>, b: DVector<f64>, init: DVector<f64>, max_iter: usize) -> DVector<f64> {
    let mut x = init.clone();
    for _ in 0..max_iter {
        x = &m_inv * (&n * &x + &b);
    }
    x
}

fn solve_by_jacobi(a: DMatrix<f64>, b: DVector<f64>, init: DVector<f64>, max_iter: usize) -> DVector<f64> {
    let d = DMatrix::from_diagonal(&a.diagonal());
    let d_inv = d.clone().try_inverse().unwrap();
    let n = &d - &a;

    solve_by_iterative(d_inv, n, b, init, max_iter)
}

fn solve_by_gauss_seidel2(a: DMatrix<f64>, b: DVector<f64>, init: DVector<f64>, max_iter: usize) -> DVector<f64> {
    let m = a.lower_triangle();
    let m_inv = m.clone().try_inverse().unwrap();
    let n = &m - &a;

    solve_by_iterative(m_inv, n, b, init, max_iter)
}

fn calc_spectral_radius(a: DMatrix<f64>) -> f64 {
    a.complex_eigenvalues().iter().map(|x| x.abs()).max_by(|x, y| x.partial_cmp(y).unwrap()).unwrap()
}

fn check_is_conv_jacobi(a: DMatrix<f64>) -> bool {
    if a.clone().try_inverse().is_none() {
        return false;
    }

    let m = DMatrix::from_diagonal(&a.diagonal());
    let m_inv = m.clone().try_inverse();
    if m_inv.is_none() {
        return false;
    }
    let n = &m - &a;

    let rad = calc_spectral_radius(&m_inv.clone().unwrap() * &n);
    println!("rad = {}", rad);

    calc_spectral_radius(&m_inv.unwrap() * &n) < 1.
}

fn check_is_conv_gauss_seidel(a: DMatrix<f64>) -> bool {
    if a.clone().try_inverse().is_none() {
        return false;
    }

    let m = a.lower_triangle();
    let m_inv = m.clone().try_inverse();
    if m_inv.is_none() {
        return false;
    }

    let n = &m - &a;

    let rad = calc_spectral_radius(&m_inv.clone().unwrap() * &n);
    println!("rad = {}", rad);

    calc_spectral_radius(&m_inv.unwrap() * &n) < 1.
}

fn main() {
    let a = DMatrix::from_row_slice(4, 4, &[
        5., 1., 1., 1.,
        0., 4., -1.,1.,
        2., 1., 5., 1.,
        -2.,1., 0., 4.,
    ]);
    let b = DVector::from_row_slice(&[56., 10., 68., 0.]);
    let init = DVector::from_row_slice(&[0., 0., 0., 0.]);
    
    let m1 = DMatrix::from_row_slice(4, 4, &[
        3., 0., 0., 0.,
        0., 3., 0., 0.,
        2., 1., 3., 0.,
        -2.,1., 0., 4.,
    ]);
    let m2 = DMatrix::from_row_slice(4, 4, &[
        4., 0., 0., 0.,
        0., 4., 0., 0.,
        2., 1., 4., 0.,
        -2.,1., 0., 4.,
    ]);

    let a2 = DMatrix::from_row_slice(4, 4, &[
        2., 4.,-4., 1.,
        2., 2., 2., 0.,
        2., 2., 1., 0.,
        2., 0., 0., 2.,
    ]);

    let a1 = DMatrix::from_row_slice(4, 4, &[
        1., 2., 3., 4.,
        4., 5., 6., 7.,
        4., 3., 2., 0.,
        0., 2., 3., 4.,
    ]);

    let x = solve_by_jacobi(a2, DVector::from_row_slice(&[1., 1., 1., 1.]), DVector::from_row_slice(&[1., 1., 1., 1.]), 200);

    println!("x = {}", x);

    
    let n1 = &m1 - &a;
    let n2 = &m2 - &a;

    let m1_inv = m1.clone().try_inverse().unwrap();
    let m2_inv = m2.clone().try_inverse().unwrap();

    // let x_1_20 = solve_by_iterative(m1_inv, n1, b.clone(), init.clone(), 2000);
    // let x_2_20 = solve_by_iterative(m2_inv, n2, b.clone(), init.clone(), 2000);

    // println!("x_1_20 = {}", x_1_20);
    // println!("x_2_20 = {}", x_2_20);
    

    // let rad = check_is_conv_jacobi(a2.clone());
    // println!("rad = {}", rad);
    // println!("test = {}", test);


}

fn create_rand_diag_dom_mat(size: usize) -> DMatrix<f64> {
    let mut mat = DMatrix::from_element(size, size, 0.);
    let mut rng = rand::thread_rng();

    for i in 0..size {
        for j in 0..size {
            mat[(i, j)] = rng.gen_range(-1.0..1.0);
        }
    }

    mat = &mat - &DMatrix::from_diagonal(&mat.diagonal());

    let sum = mat.abs().sum();
    for i in 0..size {
        let l = rng.gen_range((-sum - 1.)..-sum);
        let r = rng.gen_range(sum..(sum + 1.));
        let x = if rng.gen_range(0..2) == 0 { l } else { r };
        mat[(i, i)] = x;
    }
    mat
}

/// Solve real linear system Ax = b
/// 
/// # Arguments
/// 
/// * `size` - Size of the matrix
/// * `a` - Matrix A, stored in row-major order
/// * `b` - Vector b
/// 
/// # Returns
/// 
/// The solution of Ax = b i.e. x = A^-1 * b
#[wasm_bindgen]
pub fn solve_linear(size: usize, a: Vec<f64>, b: Vec<f64>) -> Vec<f64> {
    // check_valid_size(size, size, &a);
    // check_valid_size(size, 1, &b);

    let a = Matrix::new(size, size, a);
    let b = Vector::new(b);

    let ans = a.inverse().unwrap() * b;

    ans.into_vec()
}