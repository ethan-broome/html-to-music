import { repl } from '@strudel/core';
import { webaudioOutput } from '@strudel/webaudio';
import { 
  note,
  s,
  stack,
  cat,
} from '@strudel/core';

class SongBuilder {

    scheduler;

    constructor() {
        const { scheduler } = repl({
            defaultOutput : webaudioOutput,
        });
        this.scheduler = scheduler;
    }

    

}

export default SongBuilder;