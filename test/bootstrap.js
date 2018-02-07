import Runner from "WaveFunction/Runner";
import Formatter from "WaveFunction/Formatter";
import * as testSuites from "Test";

new Runner()
    .useFormatter(new Formatter())
    .loadSuites(testSuites).run()
;
