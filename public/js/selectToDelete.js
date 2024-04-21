import { deleteReccords } from './deleteReccord';
import { deacctivateReccords, acctivateReccords } from './deactivate';

export const selectAndDischarge = (
  selectedButton,
  reccords,
  reccordsStatus
) => {
  const reccordsCheckboxes = document.getElementsByClassName(
    `${reccords}-checkbox`
  );

  const reccordsIds = [];

  for (let i = 0; i < reccordsCheckboxes.length; i++) {
    if (reccordsCheckboxes[i].checked) {
      reccordsIds.push(reccordsCheckboxes[i].id);
    }
  }
  console.log(reccordsIds);
  if (!reccordsIds.length) {
    document.getElementById('select-warrning').textContent =
      'No reccords selected.';
    setTimeout(() => {
      document.getElementById('select-warrning').textContent = '';
    }, 1500);
  } else {
    reccordsStatus === 'acctivate'
      ? acctivateReccords(reccords, reccordsIds)
      : reccordsStatus === 'deacctivate'
      ? deacctivateReccords(reccords, reccordsIds)
      : reccordsStatus === 'delete'
      ? deleteReccords(reccords, reccordsIds)
      : (document.getElementById('select-warrning').textContent =
          'Error. Please try again');
  }
};
