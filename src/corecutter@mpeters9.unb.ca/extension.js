/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* To test this, you need to run a NESTED gnome shell. 
 * You can do that with:

   dbus-run-session -- gnome-shell --nested --wayland

*/

import GObject from 'gi://GObject';
import St from 'gi://St';
import Gio from 'gi://Gio';

const GLib = imports.gi.GLib;

import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as cb from 'resource:///org/gnome/shell/ui/checkBox.js';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as MessageTray from 'resource:///org/gnome/shell/ui/messageTray.js';

const count = (str) => {
  const re = /[0-9]{1,2}/g
  return ((str || '').match(re) || []).length
}

function execCommunicate(argv) {
    let flags = (Gio.SubprocessFlags.STDOUT_PIPE |
                 Gio.SubprocessFlags.STDERR_PIPE);

    let proc = Gio.Subprocess.new(argv, flags);

    try {
        return new Promise((resolve, reject) => {
            proc.communicate_utf8_async(null, null, (proc, res) => {
                try {
                    let [, stdout, stderr] = proc.communicate_utf8_finish(res);
                    let status = proc.get_exit_status();

                    if (status !== 0) {
                        throw new Gio.IOErrorEnum({
                            code: Gio.io_error_from_errno(status),
                            message: stderr ? stderr.trim() : GLib.strerror(status)
                        });
                    }

                    resolve(stdout.trim());
                } catch (e) {
                    reject(e);
                }
            });
        });
    } catch(e) {
        console.log(e);
        return e;
    }
}

const Indicator = GObject.registerClass(
    class Indicator extends PanelMenu.Button {
        _init() {
            super._init(0.0, _('My Shiny Indicator'));

            this.add_child(new St.Icon({
                icon_name: 'applications-utilities',
                style_class: 'system-status-icon',
            }));
                
            

            var src = Extension.lookupByUUID('corecutter@mpeters9.unb.ca').path;
            console.log(src + "\n\n\n\n");
            
            let td = new TextDecoder();
            // Get number of processing cores (aka threads)
            let cmd = "lscpu --all --parse=CPU";
            let stuff = GLib.spawn_command_line_sync(cmd)[1];
            let core_count = count(td.decode(stuff));
            
            let options = [];
            for (let i = 1; i <= core_count; i++) {
                options.push(new PopupMenu.PopupMenuItem(i.toString() + ' Cores', {}));
                options[i-1].connect('activate', async() => {
                    let _cmd = ["python3", src + "/core_cutter.py", i.toString()];
                    execCommunicate(_cmd);
                    
                    Main.notify("Notif", i.toString() + ' cores selected!');
                });
                this.menu.addMenuItem(options[i-1]);
            }
            
            let item = new PopupMenu.PopupMenuItem('Test me!', {});
            item.connect('activate', () => {
                Main.notify("Notif", 'Whatʼs up, folks?');
            });
            
            this.menu.addMenuItem(item);
        }
    }
);

export default class IndicatorExampleExtension extends Extension {
    enable() {
        this._indicator = new Indicator();
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
    }
}
