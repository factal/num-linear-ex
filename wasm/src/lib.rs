mod utils;

use std::iter::FromIterator;

use wasm_bindgen::prelude::*;
// use ndarray::prelude::*;
// use ndarray_linalg::*;
use rulinalg::{matrix::*, vector::Vector};

#[macro_use]
extern crate rulinalg;

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
pub fn greet() {
    alert("Hello, wasm!");
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

    // let a = matrix![1., 2., 2., 1.; -1., 2., 1., 0.; 0., 1., -2., 2.; 1., 2., 1., 2.];
    // let b = vector![1., 1., 1., 1.];
    // let init = vector![0., 0., 0., 0.];

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

// #[wasm_bindgen]
// pub fn solve(init: Vec<f64>, max_iter: usize) -> Vec<f64> {
//     let a = matrix![1., 2., 2., 1.; -1., 2., 1., 0.; 0., 1., -2., 2.; 1., 2., 1., 2.];
//     // let M = matrix![1., 0., 0., 0.; 0., 2., 0., 0.; 0., 0., -2., 0.; 0., 0., 0., 2.];
//     // lower triangularize A
//     let m = matrix![2., 0., 0., 0.; -2., 4., 0., 0.; 0., 2., -4., 0.; 2., 4., 2., 4.];

//     let m_inv = m.clone().inverse().unwrap();
//     let n = &m - &a;
//     let b = vector![1., 1., 1., 1.];

//     let init = Vector::new(init);

//     let x = solve_iterative(&m_inv, &n, &b, init);
//     x.into_iter().collect()
// }


// fn solve_iterative(m_inv: &Matrix<f64>, n: &Matrix<f64>, b: &Vector<f64>, x: Vector<f64>) -> Vector<f64> {
//     let ret = m_inv * (n * &x + b);
//     ret
// }
