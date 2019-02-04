/********************************************************************************
** Form generated from reading UI file 'mainwindow.ui'
**
** Created by: Qt User Interface Compiler version 5.7.1
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_MAINWINDOW_H
#define UI_MAINWINDOW_H

#include <QtCore/QVariant>
#include <QtWidgets/QAction>
#include <QtWidgets/QApplication>
#include <QtWidgets/QButtonGroup>
#include <QtWidgets/QCheckBox>
#include <QtWidgets/QDockWidget>
#include <QtWidgets/QGroupBox>
#include <QtWidgets/QHeaderView>
#include <QtWidgets/QLabel>
#include <QtWidgets/QLineEdit>
#include <QtWidgets/QMainWindow>
#include <QtWidgets/QMenu>
#include <QtWidgets/QMenuBar>
#include <QtWidgets/QRadioButton>
#include <QtWidgets/QSlider>
#include <QtWidgets/QVBoxLayout>
#include <QtWidgets/QWidget>

QT_BEGIN_NAMESPACE

class Ui_MainWindow
{
public:
    QAction *actionQuit;
    QWidget *centralWidget;
    QMenuBar *menuBar;
    QMenu *menuFile;
    QDockWidget *cityDoc;
    QWidget *CityDockContents;
    QVBoxLayout *verticalLayout_5;
    QWidget *filterDockEmptySpace;
    QGroupBox *settingSelect;
    QVBoxLayout *verticalLayout_6;
    QCheckBox *parkTog_2;
    QCheckBox *treeTog_2;
    QCheckBox *grassTog;
    QLabel *seedLabel_2;
    QSlider *seedSlider;
    QLineEdit *seedEdit;
    QLabel *rotHLabel;
    QSlider *rotHSlider;
    QLineEdit *rotEditH;
    QLabel *rotVLabel;
    QSlider *rotVSlider;
    QLineEdit *rotEditV;
    QRadioButton *spinTog;
    QRadioButton *WalkTog;

    void setupUi(QMainWindow *MainWindow)
    {
        if (MainWindow->objectName().isEmpty())
            MainWindow->setObjectName(QStringLiteral("MainWindow"));
        MainWindow->resize(485, 540);
        MainWindow->setUnifiedTitleAndToolBarOnMac(false);
        actionQuit = new QAction(MainWindow);
        actionQuit->setObjectName(QStringLiteral("actionQuit"));
        centralWidget = new QWidget(MainWindow);
        centralWidget->setObjectName(QStringLiteral("centralWidget"));
        centralWidget->setMinimumSize(QSize(0, 0));
        centralWidget->setMaximumSize(QSize(16777215, 60000));
        MainWindow->setCentralWidget(centralWidget);
        menuBar = new QMenuBar(MainWindow);
        menuBar->setObjectName(QStringLiteral("menuBar"));
        menuBar->setGeometry(QRect(0, 0, 485, 25));
        menuFile = new QMenu(menuBar);
        menuFile->setObjectName(QStringLiteral("menuFile"));
        MainWindow->setMenuBar(menuBar);
        cityDoc = new QDockWidget(MainWindow);
        cityDoc->setObjectName(QStringLiteral("cityDoc"));
        cityDoc->setEnabled(true);
        cityDoc->setMinimumSize(QSize(205, 45));
        cityDoc->setMaximumSize(QSize(524344, 524275));
        cityDoc->setFloating(false);
        CityDockContents = new QWidget();
        CityDockContents->setObjectName(QStringLiteral("CityDockContents"));
        verticalLayout_5 = new QVBoxLayout(CityDockContents);
        verticalLayout_5->setSpacing(6);
        verticalLayout_5->setContentsMargins(11, 11, 11, 11);
        verticalLayout_5->setObjectName(QStringLiteral("verticalLayout_5"));
        filterDockEmptySpace = new QWidget(CityDockContents);
        filterDockEmptySpace->setObjectName(QStringLiteral("filterDockEmptySpace"));
        filterDockEmptySpace->setEnabled(true);
        QSizePolicy sizePolicy(QSizePolicy::Preferred, QSizePolicy::Expanding);
        sizePolicy.setHorizontalStretch(0);
        sizePolicy.setVerticalStretch(0);
        sizePolicy.setHeightForWidth(filterDockEmptySpace->sizePolicy().hasHeightForWidth());
        filterDockEmptySpace->setSizePolicy(sizePolicy);
        settingSelect = new QGroupBox(filterDockEmptySpace);
        settingSelect->setObjectName(QStringLiteral("settingSelect"));
        settingSelect->setGeometry(QRect(10, 10, 171, 341));
        settingSelect->setMinimumSize(QSize(0, 0));
        settingSelect->setMaximumSize(QSize(16777215, 16777215));
        verticalLayout_6 = new QVBoxLayout(settingSelect);
        verticalLayout_6->setSpacing(6);
        verticalLayout_6->setContentsMargins(11, 11, 11, 11);
        verticalLayout_6->setObjectName(QStringLiteral("verticalLayout_6"));
        verticalLayout_6->setContentsMargins(-1, 5, -1, 5);
        parkTog_2 = new QCheckBox(settingSelect);
        parkTog_2->setObjectName(QStringLiteral("parkTog_2"));

        verticalLayout_6->addWidget(parkTog_2);

        treeTog_2 = new QCheckBox(settingSelect);
        treeTog_2->setObjectName(QStringLiteral("treeTog_2"));

        verticalLayout_6->addWidget(treeTog_2);

        grassTog = new QCheckBox(settingSelect);
        grassTog->setObjectName(QStringLiteral("grassTog"));

        verticalLayout_6->addWidget(grassTog);

        seedLabel_2 = new QLabel(settingSelect);
        seedLabel_2->setObjectName(QStringLiteral("seedLabel_2"));
        seedLabel_2->setMaximumSize(QSize(100, 16777215));

        verticalLayout_6->addWidget(seedLabel_2);

        seedSlider = new QSlider(settingSelect);
        seedSlider->setObjectName(QStringLiteral("seedSlider"));
        seedSlider->setMaximumSize(QSize(100, 16777215));
        seedSlider->setOrientation(Qt::Horizontal);

        verticalLayout_6->addWidget(seedSlider);

        seedEdit = new QLineEdit(settingSelect);
        seedEdit->setObjectName(QStringLiteral("seedEdit"));
        seedEdit->setMaximumSize(QSize(100, 16777215));

        verticalLayout_6->addWidget(seedEdit);

        rotHLabel = new QLabel(settingSelect);
        rotHLabel->setObjectName(QStringLiteral("rotHLabel"));
        rotHLabel->setMaximumSize(QSize(200, 16777215));

        verticalLayout_6->addWidget(rotHLabel);

        rotHSlider = new QSlider(settingSelect);
        rotHSlider->setObjectName(QStringLiteral("rotHSlider"));
        rotHSlider->setMaximumSize(QSize(100, 16777215));
        rotHSlider->setOrientation(Qt::Horizontal);

        verticalLayout_6->addWidget(rotHSlider);

        rotEditH = new QLineEdit(settingSelect);
        rotEditH->setObjectName(QStringLiteral("rotEditH"));
        rotEditH->setMaximumSize(QSize(100, 16777215));

        verticalLayout_6->addWidget(rotEditH);

        rotVLabel = new QLabel(settingSelect);
        rotVLabel->setObjectName(QStringLiteral("rotVLabel"));
        rotVLabel->setMaximumSize(QSize(200, 16777215));

        verticalLayout_6->addWidget(rotVLabel);

        rotVSlider = new QSlider(settingSelect);
        rotVSlider->setObjectName(QStringLiteral("rotVSlider"));
        rotVSlider->setMaximumSize(QSize(100, 16777215));
        rotVSlider->setOrientation(Qt::Horizontal);

        verticalLayout_6->addWidget(rotVSlider);

        rotEditV = new QLineEdit(settingSelect);
        rotEditV->setObjectName(QStringLiteral("rotEditV"));
        rotEditV->setMaximumSize(QSize(100, 16777215));

        verticalLayout_6->addWidget(rotEditV);

        spinTog = new QRadioButton(settingSelect);
        spinTog->setObjectName(QStringLiteral("spinTog"));

        verticalLayout_6->addWidget(spinTog);

        WalkTog = new QRadioButton(settingSelect);
        WalkTog->setObjectName(QStringLiteral("WalkTog"));

        verticalLayout_6->addWidget(WalkTog);


        verticalLayout_5->addWidget(filterDockEmptySpace);

        cityDoc->setWidget(CityDockContents);
        MainWindow->addDockWidget(static_cast<Qt::DockWidgetArea>(1), cityDoc);

        menuBar->addAction(menuFile->menuAction());
        menuFile->addAction(actionQuit);

        retranslateUi(MainWindow);
        QObject::connect(actionQuit, SIGNAL(triggered()), MainWindow, SLOT(close()));
        QObject::connect(parkTog_2, SIGNAL(toggled(bool)), treeTog_2, SLOT(setEnabled(bool)));
        QObject::connect(parkTog_2, SIGNAL(toggled(bool)), grassTog, SLOT(setEnabled(bool)));

        QMetaObject::connectSlotsByName(MainWindow);
    } // setupUi

    void retranslateUi(QMainWindow *MainWindow)
    {
        MainWindow->setWindowTitle(QApplication::translate("MainWindow", "Lab 5 - Terrain", Q_NULLPTR));
        actionQuit->setText(QApplication::translate("MainWindow", "&Quit", Q_NULLPTR));
        actionQuit->setShortcut(QApplication::translate("MainWindow", "Ctrl+Q", Q_NULLPTR));
        menuFile->setTitle(QApplication::translate("MainWindow", "Fi&le", Q_NULLPTR));
        cityDoc->setWindowTitle(QApplication::translate("MainWindow", "&CityGen", Q_NULLPTR));
        settingSelect->setTitle(QApplication::translate("MainWindow", "Settings", Q_NULLPTR));
        parkTog_2->setText(QApplication::translate("MainWindow", "Toggle Park", Q_NULLPTR));
        treeTog_2->setText(QApplication::translate("MainWindow", "ToggleTrees", Q_NULLPTR));
        grassTog->setText(QApplication::translate("MainWindow", "Toggle Grass", Q_NULLPTR));
        seedLabel_2->setText(QApplication::translate("MainWindow", "Seed", Q_NULLPTR));
        rotHLabel->setText(QApplication::translate("MainWindow", "Rot Horizontal", Q_NULLPTR));
        rotVLabel->setText(QApplication::translate("MainWindow", "Rot Vertical", Q_NULLPTR));
        spinTog->setText(QApplication::translate("MainWindow", "Sp&in", Q_NULLPTR));
        WalkTog->setText(QApplication::translate("MainWindow", "Wal&k", Q_NULLPTR));
    } // retranslateUi

};

namespace Ui {
    class MainWindow: public Ui_MainWindow {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_MAINWINDOW_H
