import { provider }                     from '../Fusion';
import DiskManager                      from './DiskManager';
import LocalDisk                        from './local/LocalDisk';
import { Config, DiskManagerInterface } from '../ServiceContracts';

@provider()
export class DiskProvider {

    constructor(container) {
        this.container = container;
    }

    register() {
        this.container
            .singleton(DiskManagerInterface, () => new DiskManager())
            .made(DiskManagerInterface, async (diskManager) => {
                const disk = (await this.container.make(Config)).disk;

                diskManager.setDefaultAdapter(disk.default);

                Object.keys(disk.disks)
                    .filter(name => disk.disks[name].adapter === 'local')
                    .forEach(name => {
                        diskManager.extend(name,

                            () => new LocalDisk().setDirectory(disk.disks[name].directory)

                        );
                    });

            });
    }

}