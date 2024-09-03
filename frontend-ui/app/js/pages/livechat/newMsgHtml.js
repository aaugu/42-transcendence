//placement values: justify-content-end, ''
export function newMsg (avatar, time, msgText, placement) {
    return `<li class="d-flex mb-4 ${placement}">
                <img src=${avatar} alt="avatar"
                class="rounded-circle d-flex align-self-start me-3 shadow-1-strong" width="30">
                <div class="card">
                <div class="card-body">
                    <p class="mb-0">
                    ${msgText}
                    </p>
                </div>
                <div class="card-footer d-flex justify-content-end">
                    <p class="small mb-0" style="font-size: 7px;">${time}</p>
                </div>
                </div>
            </li>`;
}