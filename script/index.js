const api = axios.create({
  baseURL: "https://avaliacao-final-back.herokuapp.com",
});

let list = [];

function getData() {
  api
    .get("/scraps")
    .then((response) => {
      list = response.data;
      display();
    })
    .catch((error) => console.log(error));
}

function add() {
  const value = document.getElementById("description");
  const valueDetailing = document.getElementById("detailing");

  const scrap = {
    description: value.value,
    detailing: valueDetailing.value,
  };

  api
    .post("/scraps", scrap)
    .then((response) => {
      list.push(response.data);

      value.value = "";
      valueDetailing.value = "";
      display();
    })
    .catch((error) => console.log(error));
}

function display() {
  const tableBody = document.getElementById("scrap-table-body");
  tableBody.innerHTML = "";

  for (const scrap of list) {
    tableBody.innerHTML += `<tr>
                              <td>${scrap.id}</td>
                              <td>${scrap.description}</td>
                              <td>${scrap.detailing}</td>
                              <td>
                                <button class="btn btn-danger" onclick="deleteScrap('${scrap.id}')">Apagar</button>
                                <button class="btn btn-success" onclick="openEditModal('${scrap.id}')" data-bs-toggle="modal" data-bs-target="#editModal">Editar</button>
                              </td>
                            </tr>`;
  }
}

function deleteScrap(id) {
  api
    .delete(`/scraps/${id}`)
    .then((response) => {
      const index = list.findIndex((scrap) => scrap.id == id);

      list.splice(index, 1);

      display();
    })
    .catch((error) => console.log(error));
}

const saveEditButton = document.getElementById("save-edit-button");
const closeEditButton = document.getElementById("close-edit-button");

function openEditModal(id) {
  const description = document.getElementById("edit-description");
  const detailing = document.getElementById("edit-detailing");

  const scrap = list.find((e) => e.id === id);

  description.value = scrap.description;
  detailing.value = scrap.detailing;

  saveEditButton.setAttribute("scrap-id", id);
}

function saveEdit() {
  const scrapId = saveEditButton.getAttribute("scrap-id");
  const description = document.getElementById("edit-description").value;
  const detailing = document.getElementById("edit-detailing").value;

  api
    .put(`/scraps/${scrapId}`, { description, detailing })
    .then((response) => {
      list = list.map((scrap) =>
        scrap.id == scrapId
          ? {
              ...scrap,
              description: description,
              detailing: detailing,
            }
          : scrap
      );

      display();
      closeEditButton.click();
    })
    .catch((error) => console.log(error));
}

getData();
