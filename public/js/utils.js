export function hideSpinner() {
  const spinner = document.querySelector('.spinner');
  spinner.style.display = 'none';
}

export function showSpinner() {
  const spinner = document.querySelector('.spinner');
  spinner.style.display = 'flex';
}
