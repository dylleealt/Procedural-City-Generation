/*!

 Settings.h
 CS123 Support Code

 @author  Evan Wallace (edwallac)
 @date    9/1/2010

 This file contains various settings and enumerations that you will need to
 use in the various assignments. The settings are bound to the GUI via static
 data bindings.

**/

#include "Settings.h"
#include <QFile>
#include <QSettings>

Settings settings;


/**
 * Loads the application settings, or, if no saved settings are available, loads default values for
 * the settings. You can change the defaults here.
 */
void Settings::loadSettingsOrDefaults() {
    // Set the default values below
    QSettings s("CS123", "Lab05");

    // City
    treeTog = s.value("treeTog", true).toBool();
    parkTog = s.value("parkTog", true).toBool();
    grassTog = s.value("grassTog", true).toBool();
    seed = s.value("seed", 0.2).toFloat();
    viewType = s.value("viewType", SPIN_CAM).toInt();
    rotH = s.value("rotH", 0.6).toFloat();
    rotV = s.value("rotV", 0.4).toFloat();
}

void Settings::saveSettings() {
    QSettings s("CS123", "Lab05");
    //City
    s.setValue("treeTog", treeTog);
    s.setValue("parkTog", parkTog);
    s.setValue("grassTog", grassTog);
    s.setValue("seed", seed);
    s.setValue("viewType", viewType);
    s.setValue("rotH", rotH);
    s.setValue("rotV", rotV);
}
