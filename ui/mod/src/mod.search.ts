import { text as xhrText } from 'lib/xhr';
import { sortTable, extendTablesortNumber } from 'lib/tablesort';
import { checkBoxAll, expandCheckboxZone, selector, shiftClickCheckboxRange } from './checkBoxes';
import { confirm } from 'lib/view/dialogs';

site.load.then(() => {
  $('.slist, slist-pad')
    .find('.mark-alt')
    .on('click', async function (this: HTMLAnchorElement) {
      if (await confirm('Close alt account?')) {
        xhrText(this.getAttribute('href')!, { method: 'post' });
        $(this).remove();
      }
    });

  $('.mod-user-table').each(function (this: HTMLTableElement) {
    const table = this;
    extendTablesortNumber();
    sortTable(table, { descending: true });
    expandCheckboxZone(table, 'td:last-child', shiftClickCheckboxRange(table));
    checkBoxAll(table);
    const select = table.querySelector('thead select');
    if (select)
      selector(
        table,
        select as HTMLSelectElement,
      )(async action => {
        if (action === 'alt') {
          const usernames = Array.from(
            $(table)
              .find('td:last-child input:checked')
              .map((_, input) => $(input).parents('tr').find('td:first-child').data('sort')),
          );
          if (usernames.length > 0 && (await confirm(`Close ${usernames.length} alt accounts?`))) {
            console.log(usernames);
            await xhrText('/mod/alt-many', { method: 'post', body: usernames.join(' ') });
            location.reload();
          }
        }
      });
  });
});
