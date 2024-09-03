let nameRegex: RegExp = /^[a-zA-Z]+$/;
let emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let addStudentModal = document.getElementById(
  "add-student-modal"
) as HTMLElement;
let editStudentModal = document.getElementById(
  "edit-student-modal"
) as HTMLElement;
document
  .getElementById("add-student-btn")
  ?.addEventListener("click", (): void => {
    addStudentModal.style.display = "block";
  });
document
  .getElementById("add-student-close")
  ?.addEventListener("click", (): void => {
    let errorMessage = document.getElementById(
        "add-student-error"
      ) as HTMLFormElement;
    errorMessage.innerHTML = '';
    addStudentModal.style.display = "none";
  });
document
  .getElementById("edit-student-close")
  ?.addEventListener("click", (): void => {
    let errorMessage = document.getElementById(
        "edit-student-error"
      ) as HTMLFormElement;
    errorMessage.innerHTML = '';
    editStudentModal.style.display = "none";
  });

let addStudentForm = document.getElementById(
  "add-student-form"
) as HTMLFormElement;
addStudentForm.addEventListener(
  "submit",
  async (event: Event): Promise<void> => {
    event.preventDefault();
    let studentName = document.getElementById("add-name") as HTMLFormElement;
    let studentEmail = document.getElementById("add-email") as HTMLFormElement;
    let studentAge = document.getElementById("add-age") as HTMLFormElement;
    let errorMessage = document.getElementById(
      "add-student-error"
    ) as HTMLFormElement;

    if (!nameRegex.test(studentName.value)) {
      errorMessage.innerHTML = "Please enter a valid name";
      return;
    }
    if (!emailRegex.test(studentEmail.value)) {
      errorMessage.innerHTML = "Please enter a valid email";
      return;
    }
    if (studentAge.value < 7 || studentAge.value > 20) {
      errorMessage.innerHTML = "Please enter a valid age (7 - 20)";
      return;
    }

    let response = await fetch(`add-student`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: studentName.value,
        email: studentEmail.value,
        age: studentAge.value,
      }),
    });
    if (response.ok) {
      location.reload();
      errorMessage.innerHTML = "";
      addStudentForm.reset();
    } else {
      let data = await response.json();
      errorMessage.innerHTML = data.message;
    }
  }
);

let table = document.getElementById("table") as HTMLElement;
table.addEventListener("click", async (event: Event) => {
  let target = event.target as HTMLElement;
  if (target.classList.contains("edit-btn")) {
    event.preventDefault();
    let studentId = target.getAttribute("data-student-id");
    let studentResponse = await fetch(`fetch-student/${studentId}`, {
      method: "GET",
    });
    let fetchedStudent = await studentResponse.json();
    let studentName = document.getElementById("edit-name") as HTMLFormElement;
    let studentEmail = document.getElementById("edit-email") as HTMLFormElement;
    let studentAge = document.getElementById("edit-age") as HTMLFormElement;

    studentName.value = fetchedStudent.name;
    studentEmail.value = fetchedStudent.email;
    studentAge.value = fetchedStudent.age;
    editStudentModal.setAttribute('data-student-id', studentId as string);

    editStudentModal.style.display = "block";
  } else if (target.classList.contains("delete-btn")) {
    let studentId = target.getAttribute('data-student-id');
    let reponse = await fetch(`delete-student/${studentId}`, {
        method: 'DELETE',
    });
    if(reponse.ok){
        location.reload();
    }
  }
});

document
  .getElementById("edit-student-form")
  ?.addEventListener("submit", async (event: Event) => {
    event.preventDefault();
    let studentName = document.getElementById("edit-name") as HTMLFormElement;
    let studentEmail = document.getElementById("edit-email") as HTMLFormElement;
    let studentAge = document.getElementById("edit-age") as HTMLFormElement;
    let errorMessage = document.getElementById(
        "edit-student-error"
      ) as HTMLFormElement;

      if (!nameRegex.test(studentName.value)) {
        errorMessage.innerHTML = "Please enter a valid name";
        return;
      }
      if (!emailRegex.test(studentEmail.value)) {
        errorMessage.innerHTML = "Please enter a valid email";
        return;
      }
      if (studentAge.value < 7 || studentAge.value > 20) {
        errorMessage.innerHTML = "Please enter a valid age (7 - 20)";
        return;
      }

      let studentId = editStudentModal.getAttribute('data-student-id');
      let response = await fetch(`edit-student/${studentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: studentName.value,
            email: studentEmail.value,
            age: studentAge.value,
        })
      })

      if(response.ok){
        location.reload();
        errorMessage.innerHTML = '';
      }
      else{
        let data = await response.json();
        errorMessage.innerHTML = data.message;
      }
  });
